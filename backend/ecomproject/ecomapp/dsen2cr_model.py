"""
DSen2-CR PyTorch Neural Network Model for Satellite Image Cloud Removal.
Implements the deep residual network architecture for multi-sensor fusion of
Sentinel-2 (13-band optical) and Sentinel-1 (2-band SAR) satellite imagery.
"""

import os
import torch
import torch.nn as nn
import logging
from threading import Lock

logger = logging.getLogger(__name__)

# Base path for model checkpoint weights
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHECKPOINT_PATH = os.path.join(BASE_DIR, 'ml_models', 'checkpoint.pth')


class ResnetBlock(nn.Module):
    """
    Residual Block with two 3x3 Conv2d layers, ReLU activation, and residual scaling.
    """
    def __init__(self, dim: int = 256, res_scale: float = 0.1):
        super().__init__()
        self.res_scale = res_scale
        self.conv_block = nn.Sequential(
            nn.Conv2d(dim, dim, kernel_size=3, padding=1, bias=True),
            nn.ReLU(inplace=True),
            nn.Conv2d(dim, dim, kernel_size=3, padding=1, bias=True)
        )

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return x + self.res_scale * self.conv_block(x)


class DSen2CR_Net(nn.Module):
    """
    DSen2-CR Deep Residual Network Architecture:
    - Input: 15 channels (13 Sentinel-2 Optical bands + 2 Sentinel-1 SAR bands)
    - Output: 13 channels (Cloud-free reconstructed Sentinel-2 bands)
    - Feature map size: 256
    - Residual blocks: 16
    - Long skip connection: Adds input cloudy optical bands directly to the residual output.
    """
    def __init__(
        self,
        in_channels: int = 15,
        out_channels: int = 13,
        feature_size: int = 256,
        num_blocks: int = 16
    ):
        super().__init__()
        layers = [
            nn.Conv2d(in_channels, feature_size, kernel_size=3, padding=1, bias=True),
            nn.ReLU(inplace=True)
        ]
        for _ in range(num_blocks):
            layers.append(ResnetBlock(feature_size, res_scale=0.1))
        layers.append(nn.Conv2d(feature_size, out_channels, kernel_size=3, padding=1, bias=True))
        self.model = nn.Sequential(*layers)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        # Long skip connection: add cloudy optical input (first 13 channels) to residual output
        cloudy_optical = x[:, :13, ...]
        return cloudy_optical + self.model(x)


# Global singleton model cache
_cached_model = None
_cached_device = None
_model_lock = Lock()


def get_inference_device() -> torch.device:
    """
    Determine the optimal available compute device.
    Prefers Apple Silicon MPS (Metal Performance Shaders) on macOS,
    CUDA on GPU servers, and falls back to CPU.
    """
    if torch.backends.mps.is_built() and torch.backends.mps.is_available():
        return torch.device('mps')
    elif torch.cuda.is_available():
        return torch.device('cuda')
    return torch.device('cpu')


def get_model(device: torch.device = None):
    """
    Retrieve or initialize the DSen2-CR model singleton with pre-trained checkpoint weights.
    """
    global _cached_model, _cached_device

    if device is None:
        device = get_inference_device()

    if _cached_model is None or _cached_device != device:
        with _model_lock:
            if _cached_model is not None and _cached_device == device:
                return _cached_model, _cached_device

            logger.info(f"[DSen2-CR] Initializing DSen2-CR model on {device}...")
            model = DSen2CR_Net(in_channels=15, out_channels=13, feature_size=256, num_blocks=16)

            if os.path.exists(CHECKPOINT_PATH):
                try:
                    state_dict = torch.load(CHECKPOINT_PATH, map_location='cpu', weights_only=True)
                    model.load_state_dict(state_dict)
                    logger.info(f"[DSen2-CR] Successfully loaded checkpoint from {CHECKPOINT_PATH}")
                except Exception as e:
                    logger.warning(f"[DSen2-CR] Could not load checkpoint ({e}), initializing default weights.")
            else:
                logger.warning(f"[DSen2-CR] Checkpoint not found at {CHECKPOINT_PATH}. Using randomized weights.")

            model.to(device)
            model.eval()
            _cached_model = model
            _cached_device = device

    return _cached_model, _cached_device


def get_model_info():
    """
    Returns diagnostic information about the model state and available accelerator.
    """
    device = get_inference_device()
    model, dev = get_model(device)
    param_count = sum(p.numel() for p in model.parameters())

    return {
        'model_name': 'DSen2-CR (Deep Multi-Sensor Cloud Removal Network)',
        'architecture': '16-block ResNet with Long Skip Connection',
        'in_channels': 15,
        'out_channels': 13,
        'parameters': param_count,
        'device': str(dev),
        'has_gpu_acceleration': dev.type in ['mps', 'cuda'],
        'checkpoint_path': CHECKPOINT_PATH,
        'checkpoint_exists': os.path.exists(CHECKPOINT_PATH),
        'status': 'Ready for inference'
    }
