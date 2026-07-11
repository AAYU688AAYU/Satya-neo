import React, { useState, useRef } from "react";
import { Card, Button, ProgressBar, Table } from "react-bootstrap";
import { UploadCloud, File, Trash2, CheckCircle2, AlertTriangle, RefreshCw, X, FolderOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadSystem({ onUploadSuccess }) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([
    {
      id: "hist_1",
      name: "Sentinel2A_Rajasthan_Desert_B04.tiff",
      size: "142 MB",
      crs: "EPSG:32643 (UTM 43N)",
      resolution: "10m",
      status: "Completed",
      date: "2026-07-10 14:32"
    },
    {
      id: "hist_2",
      name: "Mumbai_Harbor_SAR_VV.png",
      size: "82 MB",
      crs: "EPSG:4326 (WGS84)",
      resolution: "5m",
      status: "Completed",
      date: "2026-07-09 09:15"
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

  const validateFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    const allowed = ["tiff", "tif", "png", "jpeg", "jpg"];
    
    if (!allowed.includes(ext)) {
      return {
        valid: false,
        error: `Format .${ext} is not supported. Supported: GeoTIFF, TIFF, PNG, JPEG`
      };
    }

    // Mock validation values
    const isGeoTiff = ext === "tiff" || ext === "tif";
    return {
      valid: true,
      metadata: {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        crs: isGeoTiff ? "EPSG:32643 (UTM Zone 43N)" : "EPSG:4326 (WGS84)",
        resolution: isGeoTiff ? "10m" : "5m",
        bands: isGeoTiff ? 12 : 3,
        projection: isGeoTiff ? "Transverse Mercator" : "Geographic (Plate Carrée)",
        integrity: "Verified (MD5 Checksum OK)",
        duplicate: false
      }
    };
  };

  const addFilesToQueue = (files) => {
    const newItems = Array.from(files).map((file, idx) => {
      const validation = validateFile(file);
      return {
        id: `queue_${Date.now()}_${idx}`,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        progress: 0,
        status: validation.valid ? "Pending" : "Invalid",
        error: validation.valid ? null : validation.error,
        validation: validation.valid ? validation.metadata : null
      };
    });

    setUploadQueue((prev) => [...prev, ...newItems]);

    // Automatically trigger simulated uploads for valid files
    newItems.forEach((item) => {
      if (item.status === "Pending") {
        simulateUpload(item.id);
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

  const simulateUpload = (id) => {
    setUploadQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Uploading", progress: 0 } : item))
    );

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadQueue((prev) => {
          const item = prev.find((i) => i.id === id);
          if (item && item.validation) {
            // Trigger parent success callback
            setTimeout(() => {
              onUploadSuccess(item.validation);
              setUploadHistory((h) => [
                {
                  id: `hist_${Date.now()}`,
                  name: item.name,
                  size: item.size,
                  crs: item.validation.crs,
                  resolution: item.validation.resolution,
                  status: "Completed",
                  date: new Date().toISOString().replace("T", " ").substring(0, 16)
                },
                ...h
              ]);
            }, 300);
          }
          return prev.map((i) => (i.id === id ? { ...i, status: "Completed", progress: 100 } : i));
        });
      } else {
        setUploadQueue((prev) =>
          prev.map((i) => (i.id === id ? { ...i, progress: Math.min(progress, 99) } : i))
        );
      }
    }, 300);
  };

  const cancelUpload = (id) => {
    setUploadQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "Cancelled", progress: 0 } : item))
    );
  };

  const removeQueueItem = (id) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Card className="card-premium border-0 h-100 p-4">
      <h5 className="mb-3" style={{ fontFamily: "var(--font-secondary)" }}>
        Satellite Imagery Upload System
      </h5>

      {/* Drag and Drop Zone */}
      <div
        className={`drag-drop-zone ${dragActive ? "drag-active" : ""}`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <UploadCloud size={40} className="text-secondary mb-3 animate-pulse" />
        <p className="font-weight-bold mb-1" style={{ fontSize: "15px" }}>
          Drag & drop your imagery file here or click to browse
        </p>
        <span className="text-muted" style={{ fontSize: "12px" }}>
          Supported: GeoTIFF (.tiff, .tif), PNG, JPEG. Max size 500MB
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

      <div className="d-flex justify-content-end gap-2 mt-2">
        <Button
          size="sm"
          variant="outline-secondary"
          onClick={() => folderInputRef.current.click()}
          style={{ fontSize: "12px", borderRadius: "8px" }}
          className="d-flex align-items-center gap-1.5"
        >
          <FolderOpen size={14} /> Upload Folder
        </Button>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="mt-4">
          <h6 style={{ fontSize: "14px", fontWeight: "600" }} className="mb-2">
            Upload Queue ({uploadQueue.filter((q) => q.status === "Uploading").length} uploading)
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
                      <span className="font-weight-bold" style={{ fontSize: "13px", maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
                          <AlertTriangle size={14} /> Invalid file
                        </div>
                      )}
                      {item.status === "Uploading" && (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 text-muted"
                          onClick={() => cancelUpload(item.id)}
                        >
                          <X size={15} />
                        </Button>
                      )}
                      {(item.status === "Completed" || item.status === "Invalid" || item.status === "Cancelled") && (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 text-muted"
                          onClick={() => removeQueueItem(item.id)}
                        >
                          <Trash2 size={15} className="text-danger" />
                        </Button>
                      )}
                      {item.status === "Cancelled" && (
                        <Button
                          size="sm"
                          variant="link"
                          className="p-0 text-muted"
                          onClick={() => simulateUpload(item.id)}
                        >
                          <RefreshCw size={14} className="text-primary" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Validation Overlay Box before/during upload */}
                  {item.validation && (
                    <div className="p-2 border rounded" style={{ fontSize: "11px", backgroundColor: "#fff" }}>
                      <div className="row g-1">
                        <div className="col-6"><strong>CRS:</strong> {item.validation.crs}</div>
                        <div className="col-6"><strong>Resolution:</strong> {item.validation.resolution}</div>
                        <div className="col-6"><strong>Bands:</strong> {item.validation.bands}</div>
                        <div className="col-6"><strong>Projection:</strong> {item.validation.projection}</div>
                        <div className="col-12"><strong className="text-success">Integrity:</strong> {item.validation.integrity}</div>
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
          Recent Upload History
        </h6>
        <div className="table-responsive flex-grow-1" style={{ maxHeight: "200px", overflowY: "auto" }}>
          <Table size="sm" borderless className="table-premium align-middle mb-0" style={{ fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "rgba(0,0,0,0.02)" }}>
                <th>Filename</th>
                <th>CRS</th>
                <th>Res</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {uploadHistory.map((h) => (
                <tr key={h.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                  <td style={{ maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={h.name}>
                    {h.name}
                  </td>
                  <td className="text-muted">{h.crs.split(" ")[0]}</td>
                  <td>{h.resolution}</td>
                  <td>
                    <span className="badge-premium badge-premium-success py-1 px-2" style={{ fontSize: "10px" }}>
                      {h.status}
                    </span>
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
