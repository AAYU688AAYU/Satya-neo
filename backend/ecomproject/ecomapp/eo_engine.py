"""
Earth Observation (EO) Engine for Satya-eo Platform.
Provides multi-spectral satellite imagery preprocessing, Sentinel-2/1 normalization,
cloud & cloud-shadow detection, NDVI calculation, and PyTorch DSen2-CR neural inference.
"""

import os
import io
import time
import base64
import logging
import numpy as np
import torch
from PIL import Image

from .dsen2cr_model import get_model, get_inference_device

logger = logging.getLogger(__name__)

# DSen2-CR normalization constants
SCALE = 2000.0
MAX_VAL_SAR = 2.0
CLIP_MIN_SAR = [-25.0, -32.5]
CLIP_MAX_SAR = [0.0, 0.0]
CLIP_MIN_OPT = [0.0] * 13
CLIP_MAX_OPT = [10000.0] * 13
CLOUD_THRESHOLD = 0.22


def read_satellite_image(path: str, expected_channels: int = 13) -> np.ndarray:
    """
    Load a satellite imagery file (GeoTIFF, TIFF, PNG, JPEG) as a multi-channel float32 array (C, H, W).
    Auto-expands RGB images into full 13-band Sentinel-2 or 2-band Sentinel-1 representations.
    """
    ext = os.path.splitext(path)[1].lower()

    # Try tifffile for TIFF/GeoTIFF images
    if ext in ['.tif', '.tiff']:
        try:
            import tifffile
            data = tifffile.imread(path).astype(np.float32)
            if data.ndim == 2:
                data = data[np.newaxis, ...]
            elif data.ndim == 3 and data.shape[2] in [1, 2, 3, 4, 12, 13]:
                data = data.transpose(2, 0, 1)
            data[np.isnan(data)] = np.nanmean(data)
            return data
        except Exception as e:
            logger.warning(f"tifffile failed for {path}: {e}, falling back to PIL")

    # Standard PIL reader
    img = Image.open(path).convert('RGB')
    arr = np.array(img).astype(np.float32)  # (H, W, 3)
    arr = arr.transpose(2, 0, 1)            # (3, H, W)

    if expected_channels == 13:
        # Scale 8-bit [0, 255] to Sentinel-2 reflectance [0, 10000]
        scaled = (arr / 255.0) * 10000.0
        full = np.zeros((13, arr.shape[1], arr.shape[2]), dtype=np.float32)
        # S2 Bands mapping:
        # 0: B01 Coastal, 1: B02 Blue, 2: B03 Green, 3: B04 Red,
        # 4: B05 Veg RedEdge, 5: B06 Veg RedEdge, 6: B07 Veg RedEdge,
        # 7: B08 NIR, 8: B8A Narrow NIR, 9: B09 Water Vapor,
        # 10: B10 SWIR Cirrus, 11: B11 SWIR 1, 12: B12 SWIR 2
        full[0] = scaled[2] * 0.95            # Coastal aerosol proxy
        full[1] = scaled[2]                   # B02 Blue
        full[2] = scaled[1]                   # B03 Green
        full[3] = scaled[0]                   # B04 Red
        full[4] = scaled[0] * 0.7 + scaled[1] * 0.3  # B05
        full[5] = scaled[0] * 0.4 + scaled[1] * 0.6  # B06
        full[6] = scaled[1] * 0.8 + scaled[0] * 0.2  # B07
        full[7] = np.clip(scaled[1] * 1.5 + scaled[0] * 0.2, 0, 10000)  # B08 NIR
        full[8] = full[7] * 0.95              # B8A
        full[9] = scaled[2] * 0.6             # B09
        full[10] = scaled[0] * 0.3 + scaled[2] * 0.3 # B10 Cirrus
        full[11] = np.clip(scaled[0] * 1.1 + scaled[1] * 0.4, 0, 10000) # B11 SWIR1
        full[12] = np.clip(scaled[0] * 0.9 + scaled[1] * 0.3, 0, 10000) # B12 SWIR2
        return full

    elif expected_channels == 2:
        # Sentinel-1 SAR mapping (VV & VH backscatter in dB)
        gray = 0.299 * arr[0] + 0.587 * arr[1] + 0.114 * arr[2]
        # Map grayscale [0, 255] to SAR backscatter [-25 dB, 0 dB]
        vv = (gray / 255.0) * 25.0 - 25.0
        vh = vv - 7.5  # Cross-polarization VH is typically ~7.5 dB lower than VV
        return np.stack([vv, vh], axis=0).astype(np.float32)

    return arr


def normalize_optical(image: np.ndarray) -> np.ndarray:
    """Normalize 13-band Sentinel-2 optical image: clip to [0, 10000] and scale by 2000.0."""
    norm = image.copy()
    for c in range(norm.shape[0]):
        norm[c] = np.clip(norm[c], CLIP_MIN_OPT[c], CLIP_MAX_OPT[c])
    return (norm / SCALE).astype(np.float32)


def normalize_sar(image: np.ndarray) -> np.ndarray:
    """Normalize 2-band Sentinel-1 SAR image to [0, MAX_VAL_SAR]."""
    norm = image.copy()
    for c in range(norm.shape[0]):
        norm[c] = np.clip(norm[c], CLIP_MIN_SAR[c], CLIP_MAX_SAR[c])
        norm[c] -= CLIP_MIN_SAR[c]
        norm[c] = MAX_VAL_SAR * (norm[c] / (CLIP_MAX_SAR[c] - CLIP_MIN_SAR[c]))
    return norm.astype(np.float32)


def detect_cloud_mask(optical_array: np.ndarray, threshold: float = CLOUD_THRESHOLD) -> np.ndarray:
    """
    Detect thick clouds, thin clouds, and cloud shadows from Sentinel-2 optical bands.
    Returns array: +1 = cloud, 0 = clear, -1 = shadow.
    """
    blue = np.clip(optical_array[1] / 10000.0, 0, 1)
    red = np.clip(optical_array[3] / 10000.0, 0, 1)
    nir = np.clip(optical_array[7] / 10000.0, 0, 1) if optical_array.shape[0] > 7 else blue
    swir = np.clip(optical_array[11] / 10000.0, 0, 1) if optical_array.shape[0] > 11 else red

    # Whiteness index: clouds are bright across blue, green, red
    brightness = (blue + red) / 2.0
    
    mask = np.zeros(blue.shape, dtype=np.float32)
    # Clouds: high blue and high brightness
    mask[(blue > threshold) & (brightness > threshold * 0.9)] = 1.0
    # Cloud shadows: dark in NIR and low SWIR
    mask[(nir < 0.12) & (mask == 0)] = -1.0
    return mask


def calculate_ndvi(optical_array: np.ndarray) -> np.ndarray:
    """
    Calculate Normalized Difference Vegetation Index: NDVI = (NIR - Red) / (NIR + Red).
    NIR is Band 8 (index 7), Red is Band 4 (index 3).
    """
    red = optical_array[3].astype(np.float32)
    nir = optical_array[7].astype(np.float32) if optical_array.shape[0] > 7 else red * 1.4

    denominator = nir + red
    denominator[denominator == 0] = 1e-6
    ndvi = (nir - red) / denominator
    return np.clip(ndvi, -1.0, 1.0)


def render_ndvi_colormap(ndvi_array: np.ndarray) -> np.ndarray:
    """
    Convert 2D float NDVI array [-1.0, 1.0] into a vibrant RGB colormap.
    - Water / Cloud shadow (< 0.0): Deep Blue
    - Bare Soil / Built-up (0.0 to 0.2): Brown / Orange
    - Low Vegetation (0.2 to 0.4): Light Yellow
    - Moderate Vegetation (0.4 to 0.6): Lime Green
    - Dense Lush Canopy (> 0.6): Deep Emerald Green
    """
    h, w = ndvi_array.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)

    # Water / Non-vegetation (< 0)
    m_water = ndvi_array < 0.0
    rgb[m_water] = [20, 70, 160]

    # Barren / Urban (0.0 - 0.2)
    m_barren = (ndvi_array >= 0.0) & (ndvi_array < 0.2)
    t1 = np.clip((ndvi_array[m_barren] - 0.0) / 0.2, 0, 1)
    rgb[m_barren, 0] = (180 + t1 * 40).astype(np.uint8)
    rgb[m_barren, 1] = (120 + t1 * 60).astype(np.uint8)
    rgb[m_barren, 2] = (60 + t1 * 20).astype(np.uint8)

    # Sparse vegetation (0.2 - 0.4)
    m_sparse = (ndvi_array >= 0.2) & (ndvi_array < 0.4)
    t2 = np.clip((ndvi_array[m_sparse] - 0.2) / 0.2, 0, 1)
    rgb[m_sparse, 0] = (220 - t2 * 90).astype(np.uint8)
    rgb[m_sparse, 1] = (200 + t2 * 40).astype(np.uint8)
    rgb[m_sparse, 2] = (50 - t2 * 20).astype(np.uint8)

    # Moderate vegetation (0.4 - 0.6)
    m_mod = (ndvi_array >= 0.4) & (ndvi_array < 0.6)
    t3 = np.clip((ndvi_array[m_mod] - 0.4) / 0.2, 0, 1)
    rgb[m_mod, 0] = (130 - t3 * 90).astype(np.uint8)
    rgb[m_mod, 1] = (240 - t3 * 20).astype(np.uint8)
    rgb[m_mod, 2] = (30 + t3 * 10).astype(np.uint8)

    # Dense vegetation (>= 0.6)
    m_dense = ndvi_array >= 0.6
    t4 = np.clip((ndvi_array[m_dense] - 0.6) / 0.4, 0, 1)
    rgb[m_dense, 0] = (40 - t4 * 25).astype(np.uint8)
    rgb[m_dense, 1] = (220 - t4 * 70).astype(np.uint8)
    rgb[m_dense, 2] = (40 - t4 * 15).astype(np.uint8)

    return rgb


def render_rgb_preview(image_chw: np.ndarray, bands=(3, 2, 1), brighten_limit: float = 2200.0) -> np.ndarray:
    """
    Generate uint8 RGB preview from multi-band array using (Red, Green, Blue) indices.
    For Sentinel-2: B04 (index 3), B03 (index 2), B02 (index 1).
    """
    r = image_chw[bands[0]]
    g = image_chw[bands[1]]
    b = image_chw[bands[2]]
    rgb = np.dstack([r, g, b])
    rgb = rgb - np.nanmin(rgb)
    if brighten_limit is not None:
        rgb = np.clip(rgb, 0, brighten_limit)
    max_val = np.nanmax(rgb)
    if max_val == 0:
        rgb = np.ones_like(rgb) * 255.0
    else:
        rgb = 255.0 * (rgb / max_val)
    rgb[np.isnan(rgb)] = np.nanmean(rgb)
    return rgb.astype(np.uint8)


def render_false_color_cir(optical_array: np.ndarray) -> np.ndarray:
    """
    Render Color Infrared (CIR) composite: NIR (B08) -> Red, Red (B04) -> Green, Green (B03) -> Blue.
    Dense vegetation displays as vibrant crimson/red.
    """
    return render_rgb_preview(optical_array, bands=(7, 3, 2), brighten_limit=3000.0)


def render_sar_preview(sar_chw: np.ndarray) -> np.ndarray:
    """Render dual-polarization Sentinel-1 SAR (VV / VH) radar composite."""
    vv = np.clip(sar_chw[0], -25.0, 0.0)
    vv = (vv + 25.0) * 255.0 / 25.0
    vh = np.clip(sar_chw[1], -32.5, 0.0)
    vh = (vh + 32.5) * 255.0 / 32.5
    # Combine into radar pseudo-color (R: VV/VH ratio, G: VV, B: VH)
    ratio = np.clip((vv - vh + 128), 0, 255)
    rgb = np.dstack([ratio * 0.4, vv, vh])
    return rgb.astype(np.uint8)


def render_cloud_mask_preview(cloud_mask: np.ndarray) -> np.ndarray:
    """Render cloud mask preview: Green=Clear Ground, Dark Navy=Shadow, Pure White=Cloud."""
    h, w = cloud_mask.shape
    img = np.zeros((h, w, 3), dtype=np.uint8)
    img[cloud_mask == 0] = [34, 139, 34]    # Clear: Forest green
    img[cloud_mask < 0] = [25, 25, 60]      # Shadow: Deep navy
    img[cloud_mask > 0] = [245, 248, 255]   # Cloud: Pure white
    return img


def array_to_base64_png(rgb_uint8: np.ndarray) -> str:
    """Convert HxWx3 uint8 numpy array to base64 data URI string."""
    img = Image.fromarray(rgb_uint8)
    buf = io.BytesIO()
    img.save(buf, format='PNG', optimize=True)
    buf.seek(0)
    return 'data:image/png;base64,' + base64.b64encode(buf.read()).decode('utf-8')


def compute_eo_metrics(predicted_norm: np.ndarray, original_norm: np.ndarray, cloud_mask: np.ndarray, ndvi_array: np.ndarray) -> dict:
    """Calculate quantitative image quality and Earth Observation spectral metrics."""
    mae = float(np.mean(np.abs(predicted_norm - original_norm)))
    mse = float(np.mean((predicted_norm - original_norm) ** 2))
    psnr = float(10 * np.log10(1.0 / (mse + 1e-10)))

    cloud_coverage_pct = float(np.mean(cloud_mask > 0) * 100.0)
    shadow_coverage_pct = float(np.mean(cloud_mask < 0) * 100.0)
    clear_coverage_pct = float(np.mean(cloud_mask == 0) * 100.0)

    mean_ndvi = float(np.mean(ndvi_array))
    max_ndvi = float(np.max(ndvi_array))
    dense_veg_pct = float(np.mean(ndvi_array > 0.4) * 100.0)

    return {
        'psnr': f"{psnr:.2f} dB",
        'psnr_value': round(psnr, 2),
        'mae': f"{mae:.5f}",
        'mse': f"{mse:.5f}",
        'cloud_coverage': f"{cloud_coverage_pct:.1f}%",
        'cloud_coverage_value': round(cloud_coverage_pct, 1),
        'shadow_coverage': f"{shadow_coverage_pct:.1f}%",
        'clear_coverage': f"{clear_coverage_pct:.1f}%",
        'mean_ndvi': f"{mean_ndvi:.3f}",
        'max_ndvi': f"{max_ndvi:.3f}",
        'dense_vegetation_pct': f"{dense_veg_pct:.1f}%"
    }


def run_dsen2cr_inference(
    cloudy_path: str,
    sar_path: str = None,
    max_resolution: int = 1024
) -> dict:
    """
    Execute full DSen2-CR deep learning inference pipeline:
    1. Read and align optical and SAR imagery
    2. Run cloud & shadow detection
    3. Normalize multi-spectral inputs
    4. Run DSen2-CR PyTorch model on GPU (MPS/CUDA) or CPU
    5. Reconstruct 13-band cloud-free output
    6. Compute NDVI, CIR, True Color, and Radar previews
    7. Calculate quantitative Earth Observation metrics
    """
    t_start = time.time()

    # 1. Read cloudy optical image
    cloudy_raw = read_satellite_image(cloudy_path, expected_channels=13)
    if cloudy_raw.shape[0] < 13:
        pad = np.zeros((13 - cloudy_raw.shape[0], *cloudy_raw.shape[1:]), dtype=np.float32)
        cloudy_raw = np.concatenate([cloudy_raw, pad], axis=0)
    elif cloudy_raw.shape[0] > 13:
        cloudy_raw = cloudy_raw[:13]

    # 2. Read or synthesize SAR image
    if sar_path and os.path.exists(sar_path):
        sar_raw = read_satellite_image(sar_path, expected_channels=2)
        if sar_raw.shape[0] < 2:
            pad = np.zeros((2 - sar_raw.shape[0], *sar_raw.shape[1:]), dtype=np.float32)
            sar_raw = np.concatenate([sar_raw, pad], axis=0)
        elif sar_raw.shape[0] > 2:
            sar_raw = sar_raw[:2]
    else:
        # Synthesize SAR from NIR & SWIR spectral bands
        h, w = cloudy_raw.shape[1], cloudy_raw.shape[2]
        sar_raw = np.zeros((2, h, w), dtype=np.float32)
        sar_raw[0] = (cloudy_raw[7] / 10000.0) * (-15.0) - 5.0
        sar_raw[1] = sar_raw[0] - 7.5

    # Align spatial dimensions
    h = min(cloudy_raw.shape[1], sar_raw.shape[1])
    w = min(cloudy_raw.shape[2], sar_raw.shape[2])

    # Cap max resolution for inference performance if needed
    if h > max_resolution or w > max_resolution:
        scale_factor = min(max_resolution / h, max_resolution / w)
        new_h = int(h * scale_factor)
        new_w = int(w * scale_factor)
        # Ensure dimensions are divisible by 16 for optimal neural conv alignment
        new_h = (new_h // 16) * 16
        new_w = (new_w // 16) * 16
    else:
        new_h = (h // 16) * 16
        new_w = (w // 16) * 16

    # Convolution accepts smaller tiles, but zero-sized tensors do not.
    new_h = max(16, new_h)
    new_w = max(16, new_w)

    cloudy_raw = cloudy_raw[:, :new_h, :new_w]
    sar_raw = sar_raw[:, :new_h, :new_w]

    # 3. Detect cloud mask
    cloud_mask = detect_cloud_mask(cloudy_raw, CLOUD_THRESHOLD)

    # 4. Normalize arrays
    cloudy_norm = normalize_optical(cloudy_raw)
    sar_norm = normalize_sar(sar_raw)

    # 5. Execute PyTorch DSen2-CR Neural Network
    device = get_inference_device()
    model, dev = get_model(device)

    combined_input = np.concatenate([cloudy_norm, sar_norm], axis=0)  # (15, H, W)
    input_tensor = torch.from_numpy(combined_input).unsqueeze(0).to(dev) # (1, 15, H, W)

    t_infer_start = time.time()
    with torch.no_grad():
        output_tensor = model(input_tensor)
        if dev.type == 'mps':
            torch.mps.synchronize()
        elif dev.type == 'cuda':
            torch.cuda.synchronize()
    t_infer_end = time.time()

    output_norm = output_tensor.squeeze(0).cpu().numpy()  # (13, H, W)
    # Denormalize output back to reflectance [0, 10000]
    declouded_raw = np.clip(output_norm * SCALE, 0, 10000).astype(np.float32)

    # 6. Compute Spectral Indices
    ndvi_cloudy = calculate_ndvi(cloudy_raw)
    ndvi_declouded = calculate_ndvi(declouded_raw)

    # 7. Render Visualization Layers
    cloudy_rgb = render_rgb_preview(cloudy_raw, bands=(3, 2, 1), brighten_limit=2200.0)
    declouded_rgb = render_rgb_preview(declouded_raw, bands=(3, 2, 1), brighten_limit=2200.0)
    cir_preview = render_false_color_cir(declouded_raw)
    sar_preview = render_sar_preview(sar_raw)
    ndvi_preview = render_ndvi_colormap(ndvi_declouded)
    mask_preview = render_cloud_mask_preview(cloud_mask)

    # 8. Calculate Metrics
    metrics = compute_eo_metrics(output_norm, cloudy_norm, cloud_mask, ndvi_declouded)
    metrics['resolution'] = f"{new_w} x {new_h} px"
    metrics['bands'] = "13 Sentinel-2 + 2 SAR"
    metrics['device'] = str(dev)
    metrics['inference_time'] = f"{(t_infer_end - t_infer_start):.2f}s"
    metrics['total_time'] = f"{(time.time() - t_start):.2f}s"

    return {
        'success': True,
        'images': {
            'cloudy': array_to_base64_png(cloudy_rgb),
            'declouded': array_to_base64_png(declouded_rgb),
            'cir': array_to_base64_png(cir_preview),
            'ndvi': array_to_base64_png(ndvi_preview),
            'sar': array_to_base64_png(sar_preview),
            'mask': array_to_base64_png(mask_preview)
        },
        'metrics': metrics,
        'spatial_info': {
            'width': new_w,
            'height': new_h,
            'channels': 15,
            'output_channels': 13
        }
    }
