import React, { useState, useRef, useEffect } from "react";
import { Card, Button, Form, ProgressBar } from "react-bootstrap";
import { Play, Pause, X, RefreshCw, Download, Layers, Sliders } from "lucide-react";

import cloudyImg from "../../assets/images/cloudy.png";
import cloudfreeImg from "../../assets/images/cloudfree.png";
import ndviImg from "../../assets/images/ndvi.png";
import classificationImg from "../../assets/images/classification.png";

export default function AnalysisWorkspace({ uploadedFile }) {
  const containerRef = useRef(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [bandMode, setBandMode] = useState("truecolor"); // truecolor, colorinfrared, ndvi, classification
  const [opacity, setOpacity] = useState(1.0);
  
  // Pipeline analysis states
  const [analysisStatus, setAnalysisStatus] = useState("Idle"); // Idle, Running, Paused, Completed
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("Ready to start prediction");
  const [intervalId, setIntervalId] = useState(null);

  // Inspector states
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0, lat: 26.2389, lng: 73.0243, ndvi: 0.45 });
  const [showInspector, setShowInspector] = useState(false);

  // Drag-to-reveal slider handlers
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pos = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(pos);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      handleMove(e.clientX);
    }
    
    // Coordinates inspector details
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate mock geospatial coordinates based on pixel position
      const centerLat = uploadedFile?.name?.toLowerCase()?.includes("mumbai") ? 18.9500 : 26.2389;
      const centerLng = uploadedFile?.name?.toLowerCase()?.includes("mumbai") ? 72.8000 : 73.0243;
      
      const lat = (centerLat + (0.05 - (y / rect.height) * 0.1)).toFixed(5);
      const lng = (centerLng + ((x / rect.width) * 0.1 - 0.05)).toFixed(5);
      
      // Generate mock local NDVI index based on cursor region
      let ndvi = 0.12;
      if (bandMode === "ndvi") {
        ndvi = (Math.sin(x / 30) * Math.cos(y / 30) * 0.4 + 0.35).toFixed(2);
      }

      setCursorPos({ x, y, lat, lng, ndvi });
    }
  };

  const handleStartAnalysis = () => {
    if (analysisStatus === "Running") return;
    setAnalysisStatus("Running");
    setProgress(0);
    setProgressText("Initializing neural pipeline...");

    const steps = [
      { prg: 15, txt: "Loading multisource raster bands (SAR & Optical)..." },
      { prg: 40, txt: "Running cloud alignment and sensor calibration..." },
      { prg: 65, txt: "Executing custom neural network prediction models..." },
      { prg: 85, txt: "Removing cumulus cloud occlusion and inpainting..." },
      { prg: 100, txt: "Generating cloud-free composite and spectral index arrays..." }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        const target = steps[currentStep].prg;
        const next = prev + Math.floor(Math.random() * 5) + 3;
        
        if (next >= target) {
          setProgressText(steps[currentStep].txt);
          if (currentStep < steps.length - 1) {
            currentStep++;
          }
        }

        if (next >= 100) {
          clearInterval(interval);
          setAnalysisStatus("Completed");
          return 100;
        }
        return next;
      });
    }, 400);

    setIntervalId(interval);
  };

  const handlePauseAnalysis = () => {
    if (analysisStatus !== "Running") return;
    clearInterval(intervalId);
    setAnalysisStatus("Paused");
    setProgressText("Process paused by user");
  };

  const handleCancelAnalysis = () => {
    clearInterval(intervalId);
    setAnalysisStatus("Idle");
    setProgress(0);
    setProgressText("Analysis cancelled");
  };

  const handleResetWorkspace = () => {
    handleCancelAnalysis();
    setBandMode("truecolor");
    setSliderPosition(50);
    setOpacity(1.0);
  };

  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  // Determine active overlay image based on band mode selection
  const getOverlayImage = () => {
    switch (bandMode) {
      case "colorinfrared":
        // Simulated Infrared (Vegetation displays bright red)
        return ndviImg; 
      case "ndvi":
        return ndviImg;
      case "classification":
        return classificationImg;
      case "truecolor":
      default:
        return cloudfreeImg;
    }
  };

  return (
    <Card className="card-premium border-0 p-4 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h5 className="mb-0" style={{ fontFamily: "var(--font-secondary)" }}>
          AI Prediction & GIS Spectral Analysis Workspace
        </h5>
        {uploadedFile && (
          <span className="badge-premium badge-premium-info px-3" style={{ fontSize: "11px" }}>
            Active: {uploadedFile.name}
          </span>
        )}
      </div>

      <div className="row g-4">
        {/* Left Side: Split Image Viewer */}
        <div className="col-lg-8">
          <div
            ref={containerRef}
            className="split-slider-container"
            onMouseMove={handleMouseMove}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => {
              setIsDragging(false);
              setShowInspector(false);
            }}
            onMouseEnter={() => setShowInspector(true)}
            onTouchMove={handleTouchMove}
            onTouchStart={() => setIsDragging(true)}
            onTouchEnd={() => setIsDragging(false)}
            style={{ position: "relative", cursor: isDragging ? "ew-resize" : "default" }}
          >
            {/* Background: Raw (Before Cloudy) Image */}
            <img src={cloudyImg} alt="Before Cloudy" className="split-slider-image" />

            {/* Foreground: AI Prediction (Cloud-free / Selected Band Layer) */}
            <img
              src={getOverlayImage()}
              alt="Prediction Overlays"
              className="split-slider-image"
              style={{
                clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
                opacity: opacity
              }}
            />

            {/* Split Reveal Slider Drag Handle */}
            <div
              className="split-slider-handle"
              style={{ left: `${sliderPosition}%` }}
              onMouseDown={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
            >
              <div className="split-slider-button">
                <Sliders size={14} style={{ transform: "rotate(90deg)" }} />
              </div>
            </div>

            {/* Drag to reveal overlay titles */}
            <span className="position-absolute bg-dark text-white px-2 py-1 rounded" style={{ top: "10px", right: "10px", zIndex: 5, fontSize: "11px", opacity: 0.8 }}>
              Raw (Before)
            </span>
            <span className="position-absolute bg-primary text-white px-2 py-1 rounded" style={{ top: "10px", left: "10px", zIndex: 5, fontSize: "11px", opacity: 0.8 }}>
              AI Prediction (After)
            </span>

            {/* HUD Inspector values showing on mouse hover */}
            {showInspector && (
              <div
                className="position-absolute border"
                style={{
                  left: cursorPos.x > containerRef.current?.getBoundingClientRect()?.width - 160 ? cursorPos.x - 160 : cursorPos.x + 15,
                  top: cursorPos.y > containerRef.current?.getBoundingClientRect()?.height - 90 ? cursorPos.y - 90 : cursorPos.y + 15,
                  zIndex: 8,
                  background: "rgba(15, 23, 42, 0.9)",
                  color: "#fff",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "11px",
                  pointerEvents: "none",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
                }}
              >
                <div><strong>LAT:</strong> {cursorPos.lat}°</div>
                <div><strong>LNG:</strong> {cursorPos.lng}°</div>
                {bandMode === "ndvi" && (
                  <div style={{ color: "#4CAF50", fontWeight: "600" }}><strong>NDVI:</strong> {cursorPos.ndvi}</div>
                )}
              </div>
            )}
          </div>

          {/* Opacity Overlay Control */}
          <div className="d-flex align-items-center gap-3 mt-3 px-1">
            <span style={{ fontSize: "12px", fontWeight: "600" }} className="text-muted">Overlay Opacity:</span>
            <Form.Range
              value={opacity}
              min="0.1"
              max="1.0"
              step="0.05"
              onChange={(e) => setOpacity(parseFloat(e.target.value))}
              style={{ maxWidth: "200px" }}
            />
            <span style={{ fontSize: "12px", fontWeight: "600" }}>{Math.round(opacity * 100)}%</span>
          </div>
        </div>

        {/* Right Side: Process Controllers */}
        <div className="col-lg-4 d-flex flex-column justify-content-between">
          <div className="d-flex flex-column gap-3">
            {/* Spectral Band Selector */}
            <Card className="p-3 border-0 bg-light" style={{ borderRadius: "12px" }}>
              <h6 style={{ fontSize: "13px", fontWeight: "600" }} className="mb-2 d-flex align-items-center gap-1.5">
                <Layers size={15} className="text-secondary" /> Spectral Visualization Settings
              </h6>
              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "11px" }} className="text-muted">Band combination (RGB / Matrix)</Form.Label>
                <Form.Select
                  size="sm"
                  value={bandMode}
                  onChange={(e) => setBandMode(e.target.value)}
                  style={{ fontSize: "12px", borderRadius: "8px" }}
                  disabled={analysisStatus !== "Completed"}
                >
                  <option value="truecolor">Natural Color (Bands 4,3,2)</option>
                  <option value="colorinfrared">Color Infrared (Bands 8,4,3)</option>
                  <option value="ndvi">NDVI Vegetation index</option>
                  <option value="classification">Classified Land Cover Map</option>
                </Form.Select>
              </Form.Group>
              <span className="text-muted" style={{ fontSize: "11px" }}>
                {analysisStatus !== "Completed" && "⚠️ Run AI prediction pipeline to unlock visual spectral overlays."}
                {analysisStatus === "Completed" && bandMode === "ndvi" && "Green values indicate dense foliage; Red/Orange indicate soil/water."}
                {analysisStatus === "Completed" && bandMode === "classification" && "Color-coded land structures filtered by custom neural models."}
              </span>
            </Card>

            {/* Neural Execution Panel */}
            <Card className="p-3 border-0 bg-light" style={{ borderRadius: "12px" }}>
              <h6 style={{ fontSize: "13px", fontWeight: "600" }} className="mb-2">
                AI Prediction Pipeline status
              </h6>

              {/* Progress Indicator */}
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span style={{ fontSize: "12px", fontWeight: "600" }} className="text-primary">{analysisStatus}</span>
                  <span style={{ fontSize: "11px", fontWeight: "600" }}>{progress}%</span>
                </div>
                <ProgressBar now={progress} variant={analysisStatus === "Completed" ? "success" : "primary"} style={{ height: "6px" }} />
                <span className="text-muted d-block mt-1.5" style={{ fontSize: "11px" }}>{progressText}</span>
              </div>

              {/* Controller Toggles */}
              <div className="d-flex flex-wrap gap-2">
                {analysisStatus !== "Completed" && (
                  <>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={handleStartAnalysis}
                      disabled={analysisStatus === "Running" || !uploadedFile}
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", borderRadius: "8px" }}
                    >
                      <Play size={13} /> Start Analysis
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      onClick={handlePauseAnalysis}
                      disabled={analysisStatus !== "Running"}
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", borderRadius: "8px" }}
                    >
                      <Pause size={13} /> Pause
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={handleCancelAnalysis}
                      disabled={analysisStatus === "Idle"}
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", borderRadius: "8px" }}
                    >
                      <X size={13} /> Cancel
                    </Button>
                  </>
                )}

                {analysisStatus === "Completed" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline-primary"
                      onClick={handleResetWorkspace}
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", borderRadius: "8px" }}
                    >
                      <RefreshCw size={13} /> Reset Workspace
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-success"
                      className="d-flex align-items-center gap-1"
                      style={{ fontSize: "12px", borderRadius: "8px" }}
                      onClick={() => alert("Raster layers exported successfully in EPSG:32643!")}
                    >
                      <Download size={13} /> Export GeoTIFF
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Raster metadata panel */}
          {uploadedFile && (
            <Card className="p-3 border-0 bg-light mt-3" style={{ borderRadius: "12px" }}>
              <h6 style={{ fontSize: "13px", fontWeight: "600" }} className="mb-2">
                Raster Metadata Inspector
              </h6>
              <div style={{ fontSize: "11.5px" }} className="d-flex flex-column gap-1 text-muted">
                <div className="d-flex justify-content-between"><span>Satellite:</span><strong>Sentinel-2A</strong></div>
                <div className="d-flex justify-content-between"><span>Acquisition Date:</span><strong>2026-07-06</strong></div>
                <div className="d-flex justify-content-between"><span>Sensor Type:</span><strong>MSI Optical / SAR Fusion</strong></div>
                <div className="d-flex justify-content-between"><span>Orbit Type:</span><strong>Sun-synchronous</strong></div>
                <div className="d-flex justify-content-between"><span>Pixel Size:</span><strong>10m x 10m</strong></div>
                <div className="d-flex justify-content-between"><span>Bands:</span><strong>{uploadedFile.bands} Bands</strong></div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Card>
  );
}
