import React, { useState, useRef } from "react";
import { Card, Button, ProgressBar, Table } from "react-bootstrap";
import { UploadCloud, File, Trash2, CheckCircle2, AlertTriangle, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function UploadSystem({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: "hist_sample_1",
      name: "Sentinel2A_Rajasthan_Desert_B04.png",
      size: "1.0 MB",
      crs: "EPSG:32643 (UTM 43N)",
      resolution: "10m",
      status: "Completed",
      date: "2026-06-15 11:30",
      isSample: true
    },
    {
      id: "hist_sample_2",
      name: "Mumbai_Harbor_SAR_VV_VH.png",
      size: "1.2 MB",
      crs: "EPSG:4326 (WGS84)",
      resolution: "5m",
      status: "Completed",
      date: "2026-05-28 09:15",
      isSample: true
    }
  ]);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadFileToBackend = async (queueItem) => {
    const formData = new FormData();
    formData.append("file", queueItem.file);

    try {
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === queueItem.id ? { ...item, status: "Uploading", progress: 20 } : item))
      );

      const res = await axios.post("/api/eo/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 90) / progressEvent.total);
          setUploadQueue((prev) =>
            prev.map((item) => (item.id === queueItem.id ? { ...item, progress: percentCompleted } : item))
          );
        }
      });

      const metadata = res.data.metadata;
      setUploadQueue((prev) =>
        prev.map((item) => (item.id === queueItem.id ? { ...item, status: "Completed", progress: 100, validation: metadata } : item))
      );

      setUploadHistory((h) => [
        {
          id: metadata.id || `hist_${Date.now()}`,
          name: metadata.name,
          size: metadata.size,
          crs: metadata.crs,
          resolution: metadata.resolution,
          status: "Completed",
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          rawFile: queueItem.file
        },
        ...h
      ]);

      if (onUploadSuccess) {
        onUploadSuccess({ ...metadata, rawFile: queueItem.file });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadQueue((prev) =>
        prev.map((item) =>
          item.id === queueItem.id
            ? { ...item, status: "Invalid", error: err.response?.data?.error || "Failed to upload file to backend" }
            : item
        )
      );
    }
  };

  const addFilesToQueue = (files) => {
    const allowed = ["tiff", "tif", "png", "jpeg", "jpg"];
    const newItems = Array.from(files).map((file, idx) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const isValid = allowed.includes(ext);
      return {
        id: `queue_${Date.now()}_${idx}`,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        progress: 0,
        status: isValid ? "Pending" : "Invalid",
        error: isValid ? null : `Format .${ext} not supported. Use GeoTIFF, PNG, JPEG.`,
        validation: null
      };
    });

    setUploadQueue((prev) => [...prev, ...newItems]);

    newItems.forEach((item) => {
      if (item.status === "Pending") {
        uploadFileToBackend(item);
      }
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      addFilesToQueue(e.target.files);
    }
  };

  const handleLoadSample = () => {
    const sampleMetadata = {
      id: "S2A_RAJ_SAMPLE_01",
      name: "Sentinel-2A / Sentinel-1B Dual-Sensor Sample Scene",
      size: "1.2 MB",
      crs: "EPSG:32643 (UTM Zone 43N)",
      resolution: "10m Ground Sample",
      bands: 15,
      sensor: "Sentinel-2 Multi-Spectral + Sentinel-1 SAR",
      projection: "Universal Transverse Mercator (UTM)",
      integrity: "Verified & Pre-loaded",
      isSample: true
    };

    if (onUploadSuccess) {
      onUploadSuccess(sampleMetadata);
    }
  };

  return (
    <Card className="card-premium border-0 h-100 p-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0" style={{ fontFamily: "var(--font-secondary)" }}>
          Satellite Imagery Ingestion
        </h5>
        <Button
          size="sm"
          variant="outline-info"
          onClick={handleLoadSample}
          style={{ fontSize: "12px", borderRadius: "8px", fontWeight: "600" }}
          className="d-flex align-items-center gap-1"
        >
          <Zap size={14} className="text-warning" /> Load Sample Scene
        </Button>
      </div>

      {/* Drag and Drop Zone */}
      <div
        className={`drag-drop-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        style={{ cursor: "pointer" }}
      >
        <UploadCloud size={40} className="text-primary mb-3 animate-pulse" />
        <p className="font-weight-bold mb-1" style={{ fontSize: "15px" }}>
          Drag & drop GeoTIFF / Optical / SAR imagery here
        </p>
        <span className="text-muted" style={{ fontSize: "12px" }}>
          Supported: GeoTIFF (.tif, .tiff), PNG, JPEG. Max size 100MB
        </span>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="d-none"
          onChange={handleFileSelect}
        />
        <input
          ref={folderInputRef}
          type="file"
          webkitdirectory="true"
          directory="true"
          className="d-none"
          onChange={handleFileSelect}
        />
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="mt-4">
          <h6 style={{ fontSize: "14px", fontWeight: "600" }} className="mb-2">
            Upload & Ingestion Queue ({uploadQueue.filter((q) => q.status === "Uploading").length} active)
          </h6>
          <div className="d-flex flex-column gap-2" style={{ maxHeight: "220px", overflowY: "auto" }}>
            <AnimatePresence>
              {uploadQueue.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 border rounded d-flex flex-column gap-2"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.01)",
                    borderColor: item.status === "Invalid" ? "rgba(220, 38, 38, 0.2)" : "var(--color-border)"
                  }}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-2">
                      <File size={16} className="text-primary" />
                      <span className="font-weight-bold" style={{ fontSize: "13px", maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.name}
                      </span>
                      <span className="text-muted" style={{ fontSize: "11px" }}>
                        ({item.size})
                      </span>
                    </div>

                    <div className="d-flex align-items-center gap-1.5">
                      {item.status === "Completed" && <CheckCircle2 size={16} className="text-success" />}
                      {item.status === "Invalid" && (
                        <div className="d-flex align-items-center text-danger gap-1" style={{ fontSize: "11px" }}>
                          <AlertTriangle size={14} /> Failed
                        </div>
                      )}
                      <Button
                        size="sm"
                        variant="link"
                        className="p-0 text-muted"
                        onClick={() => setUploadQueue((prev) => prev.filter((q) => q.id !== item.id))}
                      >
                        <Trash2 size={15} className="text-danger" />
                      </Button>
                    </div>
                  </div>

                  {item.validation && (
                    <div className="p-2 border rounded" style={{ fontSize: "11px", backgroundColor: "#fff" }}>
                      <div className="row g-1">
                        <div className="col-6"><strong>CRS:</strong> {item.validation.crs}</div>
                        <div className="col-6"><strong>Resolution:</strong> {item.validation.resolution}</div>
                        <div className="col-6"><strong>Bands:</strong> {item.validation.bands}</div>
                        <div className="col-6"><strong>Sensor:</strong> {item.validation.sensor}</div>
                      </div>
                    </div>
                  )}

                  {item.status === "Invalid" && (
                    <div className="text-danger" style={{ fontSize: "11px" }}>
                      {item.error}
                    </div>
                  )}

                  {item.status === "Uploading" && (
                    <div className="d-flex align-items-center gap-3">
                      <ProgressBar now={item.progress} className="w-100" style={{ height: "4px" }} />
                      <span style={{ fontSize: "11px", fontWeight: "600" }}>{item.progress}%</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Upload History */}
      <div className="mt-4 flex-grow-1 d-flex flex-column">
        <h6 style={{ fontSize: "14px", fontWeight: "600" }} className="mb-2">
          Dataset Inventory & History
        </h6>
        <div className="table-responsive flex-grow-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Table size="sm" borderless className="table-premium align-middle mb-0" style={{ fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)" }}>
                <th>Filename</th>
                <th>CRS</th>
                <th>Res</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map((h) => (
                <tr key={h.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ maxWidth: "150px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={h.name}>
                    {h.name}
                  </td>
                  <td className="text-muted">{h.crs ? h.crs.split(" ")[0] : "EPSG:32643"}</td>
                  <td>{h.resolution || "10m"}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="link"
                      className="p-0 text-primary"
                      style={{ fontSize: "11px", textDecoration: "none", fontWeight: "600" }}
                      onClick={() => onUploadSuccess && onUploadSuccess(h)}
                    >
                      Select
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
