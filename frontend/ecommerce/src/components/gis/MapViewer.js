import React, { useEffect, useRef, useState } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { Maximize2, Minimize2, PenTool, Ruler, Trash2, CheckCircle2 } from "lucide-react";

export default function MapViewer({ uploadedFile }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const activeTileLayerRef = useRef(null);
  const boundingBoxRef = useRef(null);
  const customShapesRef = useRef([]);
  const measurementLineRef = useRef(null);
  const measurementMarkersRef = useRef([]);

  const [coordinates, setCoordinates] = useState({ lat: 26.2389, lng: 73.0243 });
  const [zoom, setZoom] = useState(6);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [basemap, setBasemap] = useState("satellite");
  const [drawingMode, setDrawingMode] = useState(false);
  const [measuringMode, setMeasuringMode] = useState(false);
  
  const [tempPoints, setTempPoints] = useState([]);
  const [measuredDistance, setMeasuredDistance] = useState(0);
  const [drawnShapesCount, setDrawnShapesCount] = useState(0);

  // Initialize Map
  useEffect(() => {
    if (!window.L) return;
    const L = window.L;

    const map = L.map(mapRef.current, {
      center: [26.2389, 73.0243],
      zoom: 6,
      zoomControl: false
    });
    mapInstanceRef.current = map;

    // Add scale bar
    L.control.scale({ position: "bottomright" }).addTo(map);

    // Initial tile layer
    const satLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri &mdash; Source: Esri"
      }
    ).addTo(map);
    activeTileLayerRef.current = satLayer;

    // Event Listeners
    map.on("mousemove", (e) => {
      setCoordinates({
        lat: e.latlng.lat.toFixed(5),
        lng: e.latlng.lng.toFixed(5)
      });
    });

    map.on("zoomend", () => {
      setZoom(map.getZoom());
    });

    map.on("click", handleMapClick);

    return () => {
      map.off();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update Basemap Tiles
  const toggleBasemap = (type) => {
    if (!mapInstanceRef.current || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (activeTileLayerRef.current) {
      map.removeLayer(activeTileLayerRef.current);
    }

    let newLayer;
    if (type === "satellite") {
      newLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        { attribution: "Tiles &copy; Esri" }
      );
    } else {
      newLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        { attribution: "&copy; OpenStreetMap" }
      );
    }

    newLayer.addTo(map);
    activeTileLayerRef.current = newLayer;
    setBasemap(type);
  };

  // Click handler for drawing & measurements
  const handleMapClick = (e) => {
    if (!window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // ROI Drawing Mode
    if (drawingMode) {
      setTempPoints((prev) => {
        const next = [...prev, [e.latlng.lat, e.latlng.lng]];
        
        // Draw temporary line indicator
        if (measurementLineRef.current) {
          map.removeLayer(measurementLineRef.current);
        }
        if (next.length > 1) {
          measurementLineRef.current = L.polyline(next, { color: "red", weight: 2 }).addTo(map);
        }
        return next;
      });
    }

    // Distance Measurement Mode
    if (measuringMode) {
      const point = e.latlng;
      setTempPoints((prev) => {
        const next = [...prev, [point.lat, point.lng]];
        
        // Add Marker point
        const marker = L.circleMarker(point, {
          radius: 6,
          fillColor: "#00BCD4",
          color: "#fff",
          weight: 2,
          fillOpacity: 1
        }).addTo(map);
        measurementMarkersRef.current.push(marker);

        // Draw line
        if (measurementLineRef.current) {
          map.removeLayer(measurementLineRef.current);
        }
        
        if (next.length > 1) {
          measurementLineRef.current = L.polyline(next, {
            color: "#00BCD4",
            weight: 3,
            dashArray: "5, 5"
          }).addTo(map);

          // Calculate total length
          let dist = 0;
          for (let i = 0; i < next.length - 1; i++) {
            const p1 = L.latLng(next[i]);
            const p2 = L.latLng(next[i + 1]);
            dist += p1.distanceTo(p2);
          }
          setMeasuredDistance((dist / 1000).toFixed(2)); // in km
        }

        return next;
      });
    }
  };

  // Complete current Drawing shape (Polygon)
  const finishDrawing = () => {
    if (tempPoints.length < 3 || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    // Draw final polygon
    const polygon = L.polygon(tempPoints, {
      color: "var(--color-primary)",
      fillColor: "rgba(11, 60, 120, 0.2)",
      weight: 3
    }).addTo(map);

    customShapesRef.current.push(polygon);
    setDrawnShapesCount(customShapesRef.current.length);

    // Reset drawing state
    resetActiveTools();
  };

  // Reset tools helper
  const resetActiveTools = () => {
    const map = mapInstanceRef.current;
    if (measurementLineRef.current && map) {
      map.removeLayer(measurementLineRef.current);
    }
    measurementLineRef.current = null;
    
    measurementMarkersRef.current.forEach((marker) => {
      if (map) map.removeLayer(marker);
    });
    measurementMarkersRef.current = [];

    setTempPoints([]);
    setDrawingMode(false);
    setMeasuringMode(false);
  };

  // Clear all annotations
  const clearAnnotations = () => {
    const map = mapInstanceRef.current;
    if (!map) return;

    resetActiveTools();
    customShapesRef.current.forEach((shape) => {
      map.removeLayer(shape);
    });
    customShapesRef.current = [];
    setDrawnShapesCount(0);
    setMeasuredDistance(0);
  };

  // Auto center map on File Uploaded bounds
  useEffect(() => {
    if (!mapInstanceRef.current || !uploadedFile || !window.L) return;
    const L = window.L;
    const map = mapInstanceRef.current;

    if (boundingBoxRef.current) {
      map.removeLayer(boundingBoxRef.current);
    }

    let centerLat = 26.2389;
    let centerLng = 73.0243;
    let nameLower = uploadedFile.name.toLowerCase();

    if (nameLower.includes("mumbai") || nameLower.includes("harbor")) {
      centerLat = 18.9500;
      centerLng = 72.8000;
    } else if (nameLower.includes("rajasthan") || nameLower.includes("desert")) {
      centerLat = 26.9124;
      centerLng = 70.9083;
    } else {
      // Default standard bounding coordinates centered
      centerLat = 26.2389;
      centerLng = 73.0243;
    }

    const bounds = [
      [centerLat - 0.05, centerLng - 0.05],
      [centerLat + 0.05, centerLng + 0.05]
    ];

    map.fitBounds(bounds);

    boundingBoxRef.current = L.rectangle(bounds, {
      color: "var(--color-secondary)",
      weight: 2,
      fillColor: "rgba(30, 136, 229, 0.1)",
      fillOpacity: 0.4
    }).addTo(map);

    // Zooming directly
    map.setZoom(12);
  }, [uploadedFile]);

  return (
    <Card className="card-premium border-0 h-100 p-0 overflow-hidden position-relative">
      {/* GIS Map Controls Toolbar overlay */}
      <div className="gis-toolbar d-flex align-items-center justify-content-between z-3 border-bottom w-100">
        <div className="d-flex align-items-center gap-2">
          {/* Basemaps toggles */}
          <Form.Select
            size="sm"
            value={basemap}
            onChange={(e) => toggleBasemap(e.target.value)}
            style={{ width: "140px", fontSize: "12px", borderRadius: "8px" }}
          >
            <option value="satellite">🛰️ Satellite view</option>
            <option value="street">🗺️ Street view</option>
          </Form.Select>

          {/* Draw ROI Polygon */}
          <Button
            size="sm"
            variant={drawingMode ? "primary" : "outline-secondary"}
            onClick={() => {
              resetActiveTools();
              setDrawingMode(true);
            }}
            className="toolbar-btn d-flex align-items-center gap-1"
            style={{ fontSize: "12px", borderRadius: "8px" }}
          >
            <PenTool size={14} /> Draw ROI
          </Button>

          {/* Distance Measure */}
          <Button
            size="sm"
            variant={measuringMode ? "primary" : "outline-secondary"}
            onClick={() => {
              resetActiveTools();
              setMeasuringMode(true);
            }}
            className="toolbar-btn d-flex align-items-center gap-1"
            style={{ fontSize: "12px", borderRadius: "8px" }}
          >
            <Ruler size={14} /> Measure
          </Button>

          {/* Delete markup */}
          {(drawnShapesCount > 0 || measuredDistance > 0 || tempPoints.length > 0) && (
            <Button
              size="sm"
              variant="outline-danger"
              onClick={clearAnnotations}
              className="toolbar-btn"
              style={{ fontSize: "12px", borderRadius: "8px" }}
            >
              <Trash2 size={14} /> Clear Markup
            </Button>
          )}
        </div>

        {/* HUD Info on toolbar */}
        <div className="d-flex align-items-center gap-3">
          {drawingMode && tempPoints.length >= 3 && (
            <Button
              size="sm"
              variant="success"
              onClick={finishDrawing}
              style={{ fontSize: "12px", borderRadius: "8px" }}
              className="d-flex align-items-center gap-1 px-3"
            >
              <CheckCircle2 size={14} /> Save Shape
            </Button>
          )}
          {measuringMode && measuredDistance > 0 && (
            <span style={{ fontSize: "12px", fontWeight: "600" }} className="text-secondary">
              Distance: {measuredDistance} km
            </span>
          )}
          {drawnShapesCount > 0 && (
            <span style={{ fontSize: "12px" }} className="text-muted">
              ROIs: {drawnShapesCount}
            </span>
          )}
        </div>
      </div>

      {/* Map Leaflet Canvas Container */}
      <div className="map-container-gis" style={{ height: isFullscreen ? "100vh" : "550px" }}>
        <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

        {/* Floating Screen Mode Controls */}
        <button
          className="navbar-icon-btn position-absolute border shadow bg-white p-2 rounded-circle"
          style={{ top: "16px", right: "16px", zIndex: 1000, width: "36px", height: "36px" }}
          onClick={() => setIsFullscreen(!isFullscreen)}
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Live Coordinate OverlayHUD */}
        <div className="map-coordinate-overlay">
          <span>LAT: {coordinates.lat}°</span>
          <span className="mx-2">|</span>
          <span>LNG: {coordinates.lng}°</span>
          <span className="mx-2">|</span>
          <span>ZOOM: {zoom}</span>
        </div>

        {/* Map Legend panel */}
        <div className="map-legend-panel">
          <div style={{ fontWeight: "600", borderBottom: "1px solid var(--color-border)", paddingBottom: "6px", marginBottom: "8px" }}>
            Land Cover Classification
          </div>
          <div className="legend-item">
            <div className="legend-color-box" style={{ background: "#2E7D32" }} />
            <span>Forest Canopy</span>
          </div>
          <div className="legend-item">
            <div className="legend-color-box" style={{ background: "#4CAF50" }} />
            <span>Agriculture Fields</span>
          </div>
          <div className="legend-item">
            <div className="legend-color-box" style={{ background: "#0288D1" }} />
            <span>Water Bodies</span>
          </div>
          <div className="legend-item">
            <div className="legend-color-box" style={{ background: "#757575" }} />
            <span>Urban / Built-up</span>
          </div>
          <div className="legend-item">
            <div className="legend-color-box" style={{ background: "#FFCC80" }} />
            <span>Barren / Desert</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
