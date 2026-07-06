import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Modal, Accordion } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, UploadCloud, Database, Cpu, FileSpreadsheet, Settings, Menu, ChevronLeft, ChevronRight,
  TrendingUp, Activity, BarChart3, PieChart, Sparkles, Filter, RefreshCw, Eye, Trash2, CheckCircle2,
  AlertTriangle, Play, Info, Layers2, FileText, Check, ChevronDown, HelpCircle, X, Search
} from "lucide-react";

// Initial mock datasets representing processed rasters
const initialRasters = [
  { id: "S2A_20260601", name: "Sentinel-2A Optical Tile (Rajasthan)", sensor: "Sentinel-2 (Optical)", date: "2026-06-01", size: "145 MB", status: "Completed", cloudCover: "4.2%", ndvi: "0.22", buildings: "2,410" },
  { id: "S1B_20260528", name: "Sentinel-1B SAR Polarization (Mumbai)", sensor: "Sentinel-1 (SAR)", date: "2026-05-28", size: "280 MB", status: "Completed", cloudCover: "0.0%", ndvi: "N/A", buildings: "12,980" },
  { id: "DEM_SRTM_30M", name: "Digital Elevation Model (Himalayas)", sensor: "DEM Elevation", date: "2026-05-20", size: "90 MB", status: "Completed", cloudCover: "0.0%", ndvi: "N/A", buildings: "120" },
  { id: "S2B_20260604", name: "Sentinel-2B Optical Cloud Cover (Kerala)", sensor: "Sentinel-2 (Optical)", date: "2026-06-04", size: "155 MB", status: "Processing", cloudCover: "72.4%", ndvi: "0.68", buildings: "Pending" },
  { id: "S2A_20260515", name: "Sentinel-2A Agricultural Tile (Punjab)", sensor: "Sentinel-2 (Optical)", date: "2026-05-15", size: "138 MB", status: "Completed", cloudCover: "12.8%", ndvi: "0.78", buildings: "840" },
  { id: "S1A_20260512", name: "Sentinel-1A SAR Structural (Chennai)", sensor: "Sentinel-1 (SAR)", date: "2026-05-12", size: "294 MB", status: "Failed", cloudCover: "0.0%", ndvi: "N/A", buildings: "N/A" }
];

export default function DashboardScreen() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [rasters, setRasters] = useState(initialRasters);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sensorFilter, setSensorFilter] = useState("All");
  const [selectedRaster, setSelectedRaster] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [stepperIndex, setStepperIndex] = useState(1);
  const [toasts, setToasts] = useState([]);

  // Filter & search logic
  const filteredRasters = rasters.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesSensor = sensorFilter === "All" || r.sensor === sensorFilter;
    return matchesSearch && matchesStatus && matchesSensor;
  });

  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setShowUploadModal(false);
            const newFile = {
              id: `S2A_20260706_${Math.floor(Math.random() * 1000)}`,
              name: "User Uploaded Satellite Raster.tiff",
              sensor: "Sentinel-2 (Optical)",
              date: "2026-07-06",
              size: "128 MB",
              status: "Completed",
              cloudCover: "8.5%",
              ndvi: "0.45",
              buildings: "1,200"
            };
            setRasters((prev) => [newFile, ...prev]);
            addToast("GeoTIFF Satellite Raster uploaded and validated successfully!");
          }, 600);
          return 100;
        }
        return p + 30;
      });
    }, 200);
  };

  const handleDeleteRaster = (id) => {
    setRasters((prev) => prev.filter((r) => r.id !== id));
    addToast("Satellite Raster successfully deleted from PostgreSQL storage", "danger");
  };

  const runPipelineStep = () => {
    if (stepperIndex < 5) {
      setStepperIndex(prev => prev + 1);
      const steps = [
        "Upload Complete",
        "Band selection and normalization computed.",
        "Cloud masks generated and removed via historical imagery.",
        "PyTorch model inference executed successfully on Sentinel networks.",
        "Post-processing completed. GeoJSON vector outputs and NDVI analytics generated!"
      ];
      addToast(steps[stepperIndex], "success");
    } else {
      setStepperIndex(1);
      addToast("Pipeline state reset to Initial Stage.", "warning");
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh", backgroundColor: "var(--color-background)" }}>
      {/* 1. Sidebar Panel */}
      <motion.div
        className="sidebar-premium"
        style={{ width: sidebarCollapsed ? "72px" : "260px" }}
        animate={{ width: sidebarCollapsed ? "72px" : "260px" }}
        transition={{ duration: 0.2 }}
      >
        <div className="d-flex align-items-center justify-content-between px-3 py-4 border-bottom border-secondary">
          {!sidebarCollapsed && (
            <div className="d-flex align-items-center gap-2">
              <Layers className="text-info" size={24} />
              <span className="font-weight-bold text-white font-secondary" style={{ fontSize: "16px", letterSpacing: "1px" }}>
                PIPELINE CONTROL
              </span>
            </div>
          )}
          {sidebarCollapsed && <Layers className="text-info mx-auto" size={24} />}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="btn btn-sm btn-link text-white p-0"
          >
            {sidebarCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <div className="d-flex flex-column justify-content-between flex-grow-1 py-3">
          <nav className="d-flex flex-column gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`sidebar-link border-0 text-left bg-transparent ${activeTab === "overview" ? "active" : ""}`}
            >
              <Activity size={18} />
              {!sidebarCollapsed && <span>Overview & Stats</span>}
            </button>
            <button
              onClick={() => setActiveTab("pipeline")}
              className={`sidebar-link border-0 text-left bg-transparent ${activeTab === "pipeline" ? "active" : ""}`}
            >
              <Cpu size={18} />
              {!sidebarCollapsed && <span>AI Models & Pipeline</span>}
            </button>
            <button
              onClick={() => setActiveTab("datasets")}
              className={`sidebar-link border-0 text-left bg-transparent ${activeTab === "datasets" ? "active" : ""}`}
            >
              <Database size={18} />
              {!sidebarCollapsed && <span>Dataset Inventory</span>}
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`sidebar-link border-0 text-left bg-transparent ${activeTab === "reports" ? "active" : ""}`}
            >
              <FileSpreadsheet size={18} />
              {!sidebarCollapsed && <span>Reports & Export</span>}
            </button>
          </nav>

          <div className="px-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="btn-premium btn-premium-primary w-100 d-flex align-items-center justify-content-center gap-2 py-2.5"
              style={{ fontSize: "13px", borderRadius: "8px" }}
            >
              <UploadCloud size={16} />
              {!sidebarCollapsed && <span>Upload Raster</span>}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Main Workspace */}
      <div className="flex-grow-1 px-4 px-lg-5 py-4 overflow-auto" style={{ maxWidth: "100%" }}>
        {/* Breadcrumb section */}
        <div className="d-flex align-items-center gap-2 text-muted mb-4" style={{ fontSize: "13px" }}>
          <span>🛰️ National EO Portal</span>
          <span>/</span>
          <span style={{ color: "var(--color-primary)", fontWeight: "600" }}>
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "pipeline" && "PyTorch Processing Pipeline"}
            {activeTab === "datasets" && "GeoTIFF Dataset Inventory"}
            {activeTab === "reports" && "Platform Analytics & Reports"}
          </span>
        </div>

        {/* Tab 1: Overview & Stats */}
        {activeTab === "overview" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-1" style={{ fontSize: "28px", color: "var(--color-primary)" }}>Dashboard Overview</h1>
                <p className="text-muted m-0">National Satellite Imagery Preprocessing & Artificial Intelligence Platform</p>
              </div>
              <Button onClick={() => addToast("Re-fetching live data from PostgreSQL cluster...", "info")} className="btn-premium btn-premium-secondary">
                <RefreshCw size={14} /> Refresh Data
              </Button>
            </div>

            {/* Metrics Row */}
            <Row className="gy-4 mb-4">
              <Col xs={12} sm={6} lg={3}>
                <div className="card-premium">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: "600" }}>Total GeoTIFFs</span>
                    <div className="p-2 rounded bg-light text-primary"><Database size={18} /></div>
                  </div>
                  <h3>8 Registered</h3>
                  <div className="d-flex align-items-center gap-1 text-success mt-2" style={{ fontSize: "12px" }}>
                    <TrendingUp size={14} />
                    <span>+2 Uploads this week</span>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <div className="card-premium">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: "600" }}>Avg Cloud Mask %</span>
                    <div className="p-2 rounded bg-light text-warning"><Sparkles size={18} /></div>
                  </div>
                  <h3>15.6%</h3>
                  <div className="d-flex align-items-center gap-1 text-muted mt-2" style={{ fontSize: "12px" }}>
                    <span>Target: &lt;10% for AI extraction</span>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <div className="card-premium">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: "600" }}>Buildings Segmented</span>
                    <div className="p-2 rounded bg-light text-success"><Cpu size={18} /></div>
                  </div>
                  <h3>16,350</h3>
                  <div className="d-flex align-items-center gap-1 text-success mt-2" style={{ fontSize: "12px" }}>
                    <TrendingUp size={14} />
                    <span>99.2% model confidence</span>
                  </div>
                </div>
              </Col>
              <Col xs={12} sm={6} lg={3}>
                <div className="card-premium">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span style={{ color: "var(--color-text-muted)", fontSize: "14px", fontWeight: "600" }}>GPU Pipeline Health</span>
                    <div className="p-2 rounded bg-light text-info"><Activity size={18} /></div>
                  </div>
                  <h3>99.98%</h3>
                  <div className="d-flex align-items-center gap-1 text-success mt-2" style={{ fontSize: "12px" }}>
                    <span>All PyTorch services operational</span>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Custom SVG Charts Row */}
            <Row className="gy-4 mb-4">
              <Col lg={7}>
                <div className="card-premium h-100">
                  <h5 className="mb-4" style={{ fontFamily: "var(--font-secondary)" }}>AI Model Segmentation Accuracy (Epochs)</h5>
                  {/* SVG Area/Line Chart */}
                  <div style={{ height: "230px", width: "100%", position: "relative" }}>
                    <svg viewBox="0 0 500 200" width="100%" height="100%">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-secondary)" stopOpacity="0.2"/>
                          <stop offset="100%" stopColor="var(--color-secondary)" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
                      <line x1="40" y1="170" x2="480" y2="170" stroke="#cbd5e1" strokeWidth="1" />
                      
                      {/* Area Path */}
                      <path d="M 40 170 Q 120 110, 200 90 T 360 40 T 480 30 L 480 170 Z" fill="url(#areaGrad)" />
                      {/* Line Path */}
                      <path d="M 40 170 Q 120 110, 200 90 T 360 40 T 480 30" fill="none" stroke="var(--color-primary)" strokeWidth="3" />
                      
                      {/* Points */}
                      <circle cx="200" cy="90" r="5" fill="var(--color-accent)" />
                      <circle cx="360" cy="40" r="5" fill="var(--color-accent)" />
                      <circle cx="480" cy="30" r="5" fill="var(--color-accent)" />

                      {/* X labels */}
                      <text x="40" y="190" fontSize="10" fill="#94a3b8">Epoch 0</text>
                      <text x="150" y="190" fontSize="10" fill="#94a3b8">Epoch 20</text>
                      <text x="260" y="190" fontSize="10" fill="#94a3b8">Epoch 40</text>
                      <text x="370" y="190" fontSize="10" fill="#94a3b8">Epoch 60</text>
                      <text x="450" y="190" fontSize="10" fill="#94a3b8">Epoch 80 (Final)</text>
                      
                      {/* Y Labels */}
                      <text x="5" y="25" fontSize="10" fill="#94a3b8">99%</text>
                      <text x="5" y="75" fontSize="10" fill="#94a3b8">90%</text>
                      <text x="5" y="125" fontSize="10" fill="#94a3b8">70%</text>
                      <text x="5" y="175" fontSize="10" fill="#94a3b8">50%</text>
                    </svg>
                  </div>
                </div>
              </Col>
              
              <Col lg={5}>
                <div className="card-premium h-100">
                  <h5 className="mb-4" style={{ fontFamily: "var(--font-secondary)" }}>Pipeline Memory Allocation</h5>
                  {/* SVG Pie/Donut Chart */}
                  <div className="d-flex align-items-center justify-content-center" style={{ height: "230px" }}>
                    <svg width="180" height="180" viewBox="0 0 36 36" className="circular-chart">
                      {/* Segment 1: Preprocessing (Blue) */}
                      <path className="circle-bg"
                        stroke="#e2e8f0"
                        strokeWidth="3.8"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Segment 2: AI inference (Dark Blue) */}
                      <path className="circle"
                        stroke="var(--color-primary)"
                        strokeDasharray="45, 100"
                        strokeWidth="3.8"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Segment 3: Cloud removal (Sky blue) */}
                      <path className="circle"
                        stroke="var(--color-secondary)"
                        strokeDasharray="25, 100"
                        strokeDashoffset="-45"
                        strokeWidth="3.8"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      {/* Segment 4: Other (Accent) */}
                      <path className="circle"
                        stroke="var(--color-accent)"
                        strokeDasharray="15, 100"
                        strokeDashoffset="-70"
                        strokeWidth="3.8"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <g className="chart-text">
                        <text x="18" y="20.5" className="percent" textAnchor="middle" fontSize="6px" fontWeight="bold" fill="var(--color-primary)">
                          85% Shared
                        </text>
                      </g>
                    </svg>
                    
                    <div className="d-flex flex-column gap-2 ms-4" style={{ fontSize: "12px" }}>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--color-primary)" }} />
                        <span>AI Inference (45%)</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--color-secondary)" }} />
                        <span>Cloud Removal (25%)</span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "var(--color-accent)" }} />
                        <span>Preprocessing (15%)</span>
                      </div>
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#e2e8f0" }} />
                        <span>Free Space (15%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

            {/* Quick Actions & Recent Updates */}
            <Row className="gy-4">
              <Col lg={4}>
                <div className="card-premium h-100">
                  <h5 className="mb-3" style={{ fontFamily: "var(--font-secondary)" }}>Quick Admin Actions</h5>
                  <div className="d-flex flex-column gap-3">
                    <Button onClick={() => setShowUploadModal(true)} className="btn-premium btn-premium-primary text-white w-100 justify-content-start">
                      <UploadCloud size={16} /> Upload New GeoTIFF Raster
                    </Button>
                    <Button onClick={() => setActiveTab("pipeline")} className="btn-premium btn-premium-outline w-100 justify-content-start text-dark">
                      <Cpu size={16} /> Run PyTorch Inference
                    </Button>
                    <Button onClick={() => {
                      addToast("Exporting GeoJSON vector coordinates...", "info");
                    }} className="btn-premium btn-premium-outline w-100 justify-content-start text-dark">
                      <FileText size={16} /> Generate Vector GeoJSON
                    </Button>
                    <Button onClick={() => {
                      addToast("Downloading full platform report...", "success");
                    }} className="btn-premium btn-premium-secondary w-100 justify-content-start">
                      <FileSpreadsheet size={16} /> Export CSV Database
                    </Button>
                  </div>
                </div>
              </Col>

              <Col lg={8}>
                <div className="card-premium h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0" style={{ fontFamily: "var(--font-secondary)" }}>Active Processing Logs</h5>
                    <span className="badge-premium badge-premium-info">4 active tasks</span>
                  </div>
                  
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-start gap-3 p-2 rounded hover:bg-light" style={{ transition: "var(--transition-fast)" }}>
                      <span className="p-2 rounded bg-success-light text-success mt-1"><CheckCircle2 size={16} /></span>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>NDVI Vegetation Analytics Complete</div>
                        <div className="text-muted" style={{ fontSize: "12px" }}>Processed tile S2A_202 Punjabi Ag. Generated average index values.</div>
                      </div>
                      <span className="text-muted" style={{ fontSize: "11px" }}>2 mins ago</span>
                    </div>

                    <div className="d-flex align-items-start gap-3 p-2 rounded hover:bg-light" style={{ transition: "var(--transition-fast)" }}>
                      <span className="p-2 rounded bg-warning-light text-warning mt-1"><AlertTriangle size={16} /></span>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>Heavy Cloud Coverage Detected</div>
                        <div className="text-muted" style={{ fontSize: "12px" }}>Kerala coastline tile shows 72.4% cloud occlusion. Activating multi-temporal SAR fusion...</div>
                      </div>
                      <span className="text-muted" style={{ fontSize: "11px" }}>10 mins ago</span>
                    </div>

                    <div className="d-flex align-items-start gap-3 p-2 rounded hover:bg-light" style={{ transition: "var(--transition-fast)" }}>
                      <span className="p-2 rounded bg-info-light text-info mt-1"><Play size={16} /></span>
                      <div className="flex-grow-1">
                        <div style={{ fontWeight: "600", fontSize: "14px" }}>UNet Building Segmentation Running</div>
                        <div className="text-muted" style={{ fontSize: "12px" }}>Running Deep Learning GPU worker nodes on Mumbai Polarization SAR imagery.</div>
                      </div>
                      <span className="text-muted" style={{ fontSize: "11px" }}>Active</span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        )}

        {/* Tab 2: AI Models & Pipeline */}
        {activeTab === "pipeline" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="mb-1" style={{ fontSize: "28px", color: "var(--color-primary)" }}>AI PyTorch Processing Pipeline</h1>
            <p className="text-muted mb-4">Observe, test, and control the step-by-step deep learning classification flow.</p>

            {/* Stepper Component */}
            <div className="card-premium p-4 mb-4">
              <h5 className="mb-4" style={{ fontFamily: "var(--font-secondary)" }}>Pipeline Execution Stepper</h5>
              
              <div className="stepper-premium px-md-5">
                <div className={`stepper-step ${stepperIndex >= 1 ? "active" : ""} ${stepperIndex > 1 ? "completed" : ""}`}>
                  {stepperIndex > 1 ? <Check size={16} /> : "1"}
                </div>
                <div className={`stepper-step ${stepperIndex >= 2 ? "active" : ""} ${stepperIndex > 2 ? "completed" : ""}`}>
                  {stepperIndex > 2 ? <Check size={16} /> : "2"}
                </div>
                <div className={`stepper-step ${stepperIndex >= 3 ? "active" : ""} ${stepperIndex > 3 ? "completed" : ""}`}>
                  {stepperIndex > 3 ? <Check size={16} /> : "3"}
                </div>
                <div className={`stepper-step ${stepperIndex >= 4 ? "active" : ""} ${stepperIndex > 4 ? "completed" : ""}`}>
                  {stepperIndex > 4 ? <Check size={16} /> : "4"}
                </div>
                <div className={`stepper-step ${stepperIndex >= 5 ? "active" : ""} ${stepperIndex > 5 ? "completed" : ""}`}>
                  {stepperIndex > 5 ? <Check size={16} /> : "5"}
                </div>
              </div>
              
              <div className="d-flex justify-content-between text-center px-0 mb-4" style={{ fontSize: "11px", fontWeight: "600", color: "var(--color-text-muted)" }}>
                <span className="w-20">1. Upload & Validate</span>
                <span className="w-20">2. Normalization</span>
                <span className="w-20">3. Cloud Removal</span>
                <span className="w-20">4. AI Segmentation</span>
                <span className="w-20">5. Report & Vector</span>
              </div>

              <div className="p-3 bg-light rounded d-flex align-items-center gap-3 mb-4">
                <Info className="text-secondary" size={20} />
                <div style={{ fontSize: "14px" }}>
                  <strong>Current Stage {stepperIndex}</strong>: {
                    stepperIndex === 1 ? "Upload the GeoTIFF raster image file. Platform validates bounds, projection system, and integrity." :
                    stepperIndex === 2 ? "Apply histogram equalization and band alignment for optical or SAR feeds." :
                    stepperIndex === 3 ? "Compute difference masks and patch cloud obstructions using multi-temporal archives." :
                    stepperIndex === 4 ? "Trigger segmentation via UNet and SegFormer neural layers in PyTorch." :
                    "Export clean GeoJSON map boundary files and downloadable analytical PDF reports."
                  }
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <Button disabled={stepperIndex === 1} onClick={() => setStepperIndex(prev => prev - 1)} className="btn-premium btn-premium-secondary">
                  Previous Step
                </Button>
                <Button onClick={runPipelineStep} className="btn-premium btn-premium-primary">
                  {stepperIndex === 5 ? "Reset Stepper" : "Advance Pipeline"} <Play size={14} className="ms-1" />
                </Button>
              </div>
            </div>

            {/* Accordion Component - Model details */}
            <div className="card-premium p-4">
              <h5 className="mb-4" style={{ fontFamily: "var(--font-secondary)" }}>Deep Learning Model Documentation</h5>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0" className="border border-light rounded mb-3 overflow-hidden">
                  <Accordion.Header className="font-secondary">
                    <div className="d-flex align-items-center gap-2">
                      <Sparkles size={16} className="text-primary" />
                      <strong>UNet Cloud Detection Network</strong>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Uses multi-band input (Red, Green, Blue, Near-Infrared) to classify thin clouds, thick clouds, and cloud shadows. Generates a confidence probability layer with 95%+ precision rates to guide downstream temporal synthesis algorithms.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1" className="border border-light rounded mb-3 overflow-hidden">
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      <Cpu size={16} className="text-primary" />
                      <strong>SegFormer Transformer (Road & Boundary Extraction)</strong>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    A semantic segmentation model using coordinate-aware self-attention mapping. Operates at pixel-level resolution to cleanly isolate highways, local paths, and administrative boundaries.
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2" className="border border-light rounded overflow-hidden">
                  <Accordion.Header>
                    <div className="d-flex align-items-center gap-2">
                      <Layers2 size={16} className="text-primary" />
                      <strong>SAR / DEM Encoder Fusion</strong>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body>
                    Combines microwave radar return backscatter signatures (Sentinel-1) with elevation contours (Digital Elevation Models) to perform building detection, contour mapping, and geological classification regardless of atmospheric cloud layers.
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          </motion.div>
        )}

        {/* Tab 3: Dataset Inventory */}
        {activeTab === "datasets" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-1" style={{ fontSize: "28px", color: "var(--color-primary)" }}>GeoTIFF Dataset Inventory</h1>
                <p className="text-muted m-0">Browse, search, and manage uploaded satellite rasters.</p>
              </div>
              <Button onClick={() => setShowUploadModal(true)} className="btn-premium btn-premium-primary text-white">
                <UploadCloud size={15} /> Upload Raster
              </Button>
            </div>

            {/* Filter controls row */}
            <div className="card-premium p-3 mb-4">
              <Row className="gy-3 align-items-center">
                <Col md={4}>
                  <div className="position-relative">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search by filename or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ paddingLeft: "35px", borderRadius: "8px", fontSize: "14px" }}
                    />
                    <Search className="position-absolute text-muted" size={16} style={{ left: "12px", top: "11px" }} />
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center gap-2">
                    <Filter size={14} className="text-muted" />
                    <select
                      className="form-select text-muted"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      style={{ borderRadius: "8px", fontSize: "14px" }}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Completed">Completed</option>
                      <option value="Processing">Processing</option>
                      <option value="Failed">Failed</option>
                    </select>
                  </div>
                </Col>
                <Col md={3}>
                  <div className="d-flex align-items-center gap-2">
                    <Layers size={14} className="text-muted" />
                    <select
                      className="form-select text-muted"
                      value={sensorFilter}
                      onChange={(e) => setSensorFilter(e.target.value)}
                      style={{ borderRadius: "8px", fontSize: "14px" }}
                    >
                      <option value="All">All Sensors</option>
                      <option value="Sentinel-2 (Optical)">Sentinel-2 (Optical)</option>
                      <option value="Sentinel-1 (SAR)">Sentinel-1 (SAR)</option>
                      <option value="DEM Elevation">DEM Elevation</option>
                    </select>
                  </div>
                </Col>
                <Col md={2} className="text-md-end">
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("All");
                      setSensorFilter("All");
                    }}
                    variant="link"
                    className="p-0 text-decoration-none text-muted"
                    style={{ fontSize: "13px" }}
                  >
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </div>

            {/* Inventory table */}
            <div className="table-premium-container">
              {filteredRasters.length > 0 ? (
                <Table responsive className="table-premium mb-0">
                  <thead>
                    <tr>
                      <th>Raster ID</th>
                      <th>Filename / Area</th>
                      <th>Sensor Type</th>
                      <th>Uploaded</th>
                      <th>Cloud %</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRasters.map((raster) => (
                      <tr key={raster.id}>
                        <td style={{ fontWeight: "600", fontSize: "13px" }}>{raster.id}</td>
                        <td>{raster.name}</td>
                        <td className="text-muted">{raster.sensor}</td>
                        <td>{raster.date}</td>
                        <td>{raster.cloudCover}</td>
                        <td>
                          <span className={`badge-premium ${
                            raster.status === "Completed" ? "badge-premium-success" :
                            raster.status === "Processing" ? "badge-premium-warning" : "badge-premium-danger"
                          }`}>
                            {raster.status}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              onClick={() => setSelectedRaster(raster)}
                              size="sm"
                              className="btn-premium btn-premium-outline p-1.5"
                              title="View Metadata"
                            >
                              <Eye size={14} />
                            </Button>
                            <Button
                              onClick={() => handleDeleteRaster(raster.id)}
                              size="sm"
                              className="btn-premium btn-premium-ghost p-1.5 text-danger"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                /* Empty state */
                <div className="text-center py-5">
                  <Database size={44} className="text-muted mb-3 mx-auto" />
                  <h5>No datasets found</h5>
                  <p className="text-muted" style={{ fontSize: "14px" }}>No satellite imagery matches the applied search filters.</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("All");
                      setSensorFilter("All");
                    }}
                    className="btn-premium btn-premium-primary btn-sm mt-2"
                  >
                    Reset Search
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Tab 4: Reports & Exports */}
        {activeTab === "reports" && (
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <h1 className="mb-1" style={{ fontSize: "28px", color: "var(--color-primary)" }}>Platform Analytics & Reports</h1>
            <p className="text-muted mb-4">Export vector shapefiles, view NDVI vegetation tables, and compile analytics.</p>

            <Row className="gy-4">
              <Col md={6}>
                <div className="card-premium h-100">
                  <h5 className="mb-3" style={{ fontFamily: "var(--font-secondary)" }}>Export Geospatial Products</h5>
                  <p className="text-muted" style={{ fontSize: "13px" }}>
                    Select and download standard vector outputs generated after PyTorch deep segmentation.
                  </p>
                  
                  <div className="d-flex flex-column gap-3 mt-4">
                    <div className="p-3 border rounded d-flex align-items-center justify-content-between bg-light">
                      <div className="d-flex align-items-center gap-3">
                        <Layers2 size={24} className="text-primary" />
                        <div>
                          <div style={{ fontWeight: "600" }}>Building Footprint Polygons</div>
                          <span className="text-muted" style={{ fontSize: "12px" }}>GeoJSON Coordinate Format</span>
                        </div>
                      </div>
                      <Button onClick={() => addToast("Downloading vector GeoJSON...", "success")} className="btn-premium btn-premium-outline btn-sm">
                        Download
                      </Button>
                    </div>

                    <div className="p-3 border rounded d-flex align-items-center justify-content-between bg-light">
                      <div className="d-flex align-items-center gap-3">
                        <FileText size={24} className="text-warning" />
                        <div>
                          <div style={{ fontWeight: "600" }}>NDVI Vegetation Density Map</div>
                          <span className="text-muted" style={{ fontSize: "12px" }}>Raster GeoTIFF Format (16-Band)</span>
                        </div>
                      </div>
                      <Button onClick={() => addToast("Downloading NDVI Raster...", "success")} className="btn-premium btn-premium-outline btn-sm">
                        Download
                      </Button>
                    </div>

                    <div className="p-3 border rounded d-flex align-items-center justify-content-between bg-light">
                      <div className="d-flex align-items-center gap-3">
                        <FileSpreadsheet size={24} className="text-success" />
                        <div>
                          <div style={{ fontWeight: "600" }}>Infrastructure Change Log</div>
                          <span className="text-muted" style={{ fontSize: "12px" }}>MS Excel Tabular Sheet</span>
                        </div>
                      </div>
                      <Button onClick={() => addToast("Downloading Excel Spreadsheet...", "success")} className="btn-premium btn-premium-outline btn-sm">
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>

              <Col md={6}>
                <div className="card-premium h-100">
                  <h5 className="mb-3" style={{ fontFamily: "var(--font-secondary)" }}>Agricultural NDVI Density Statistics</h5>
                  <div className="table-premium-container mt-4">
                    <Table responsive className="table-premium mb-0">
                      <thead>
                        <tr>
                          <th>Region Code</th>
                          <th>Mean NDVI</th>
                          <th>Vegetation Cover %</th>
                          <th>Crop Health</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontWeight: "600" }}>IND-PB-02</td>
                          <td>0.78</td>
                          <td>82.4%</td>
                          <td><span className="badge-premium badge-premium-success">Excellent</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "600" }}>IND-RJ-04</td>
                          <td>0.22</td>
                          <td>14.8%</td>
                          <td><span className="badge-premium badge-premium-danger">Sparse</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "600" }}>IND-KL-07</td>
                          <td>0.68</td>
                          <td>76.2%</td>
                          <td><span className="badge-premium badge-premium-success">Healthy</span></td>
                        </tr>
                        <tr>
                          <td style={{ fontWeight: "600" }}>IND-MH-01</td>
                          <td>0.45</td>
                          <td>39.1%</td>
                          <td><span className="badge-premium badge-premium-warning">Moderate</span></td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Col>
            </Row>
          </motion.div>
        )}
      </div>

      {/* 2. Upload Modal component */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} centered>
        <form onSubmit={handleUploadSubmit}>
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title style={{ fontFamily: "var(--font-secondary)", fontWeight: "600", fontSize: "18px" }}>
              Upload Satellite Imagery File
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            {!isUploading ? (
              <div
                style={{
                  border: "2px dashed var(--color-border)",
                  borderRadius: "12px",
                  padding: "35px 20px",
                  textAlign: "center",
                  background: "rgba(11, 60, 120, 0.01)",
                  cursor: "pointer"
                }}
                onClick={() => addToast("Initiating system file dialogue...", "info")}
              >
                <UploadCloud className="text-secondary mb-3 mx-auto" size={40} />
                <h6 className="mb-2">Drag & Drop GeoTIFF Raster File</h6>
                <p className="text-muted m-0" style={{ fontSize: "12px" }}>
                  Supports .tiff, .tif, .geojson files up to 500 MB.
                </p>
                <p className="text-muted m-0 mt-1" style={{ fontSize: "11px", fontWeight: "600" }}>
                  Click to browse from local computer
                </p>
              </div>
            ) : (
              <div className="py-4 text-center">
                <RefreshCw className="animate-spin text-primary mb-3 mx-auto" size={32} />
                <h6>Uploading and Validating CRS Coordinates...</h6>
                <div className="progress mt-3" style={{ height: "8px", borderRadius: "10px" }}>
                  <div
                    className="progress-bar bg-primary"
                    style={{ width: `${uploadProgress}%`, borderRadius: "10px" }}
                  />
                </div>
                <span className="text-muted d-block mt-2" style={{ fontSize: "12px" }}>
                  {uploadProgress}% Complete
                </span>
              </div>
            )}

            <div className="form-floating-premium mt-4">
              <input type="text" id="areaName" placeholder="Area Name" required defaultValue="Rajasthan Border Sentinel Patch" />
              <label htmlFor="areaName">Area Location Name</label>
            </div>
            
            <div className="form-floating-premium">
              <select id="sensorType" required>
                <option value="Sentinel-2 (Optical)">Sentinel-2 (Optical)</option>
                <option value="Sentinel-1 (SAR)">Sentinel-1 (SAR)</option>
                <option value="DEM Elevation">DEM Elevation</option>
              </select>
              <label htmlFor="sensorType">Satellite Sensor Type</label>
            </div>
          </Modal.Body>
          <Modal.Footer className="border-0 pt-0">
            <Button variant="outline-secondary" className="btn-premium btn-premium-outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading} className="btn-premium btn-premium-primary text-white">
              Start Import
            </Button>
          </Modal.Footer>
        </form>
      </Modal>

      {/* 3. Sliding Metadata Drawer Panel (using framer-motion) */}
      <AnimatePresence>
        {selectedRaster && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRaster(null)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "black",
                zIndex: 1040
              }}
            />
            
            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                width: "420px",
                height: "100vh",
                background: "white",
                boxShadow: "-10px 0 30px rgba(0,0,0,0.1)",
                zIndex: 1050,
                padding: "30px",
                overflowY: "auto"
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h5 className="m-0" style={{ fontFamily: "var(--font-secondary)" }}>Metadata Details</h5>
                <button className="btn btn-link text-dark p-0" onClick={() => setSelectedRaster(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="d-flex flex-column gap-3" style={{ fontSize: "14px" }}>
                <div>
                  <label className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>File Identifier</label>
                  <strong style={{ fontFamily: "monospace" }}>{selectedRaster.id}</strong>
                </div>

                <div>
                  <label className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Dataset Name</label>
                  <span>{selectedRaster.name}</span>
                </div>

                <div>
                  <label className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Satellite Sensor Source</label>
                  <span className="badge-premium badge-premium-info">{selectedRaster.sensor}</span>
                </div>

                <div>
                  <label className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Date Captured</label>
                  <span>{selectedRaster.date}</span>
                </div>

                <div>
                  <label className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>GeoTIFF File Size</label>
                  <span>{selectedRaster.size}</span>
                </div>

                <div>
                  <label className="text-muted d-block mb-1" style={{ fontSize: "12px" }}>Status Code</label>
                  <span className={`badge-premium ${selectedRaster.status === "Completed" ? "badge-premium-success" : "badge-premium-warning"}`}>
                    {selectedRaster.status}
                  </span>
                </div>

                <hr />

                <h6 style={{ fontFamily: "var(--font-secondary)", marginTop: "10px" }}>Extracted Analytics Mapping</h6>
                
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Cloud Occurrence</span>
                  <strong>{selectedRaster.cloudCover}</strong>
                </div>
                
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Mean Normalized Difference (NDVI)</span>
                  <strong>{selectedRaster.ndvi}</strong>
                </div>

                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Estimated Building Boundaries</span>
                  <strong>{selectedRaster.buildings}</strong>
                </div>

                <div className="d-flex justify-content-between py-2">
                  <span className="text-muted">Coordinate Reference System</span>
                  <strong>EPSG:4326 (WGS 84)</strong>
                </div>
              </div>

              <div className="mt-5">
                <Button onClick={() => addToast("Re-checking CRS integrity...", "info")} className="btn-premium btn-premium-primary text-white w-100">
                  Trigger Validation Audit
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 4. Live Toast Notification popups */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: toast.type === "danger" ? "#FEF2F2" : toast.type === "warning" ? "#FFFBEB" : toast.type === "info" ? "#EFF6FF" : "#F0FDF4",
                borderLeft: `5px solid ${
                  toast.type === "danger" ? "var(--color-danger)" : toast.type === "warning" ? "var(--color-warning)" : toast.type === "info" ? "var(--color-secondary)" : "var(--color-success)"
                }`,
                borderRadius: "8px",
                padding: "16px 20px",
                width: "320px",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                display: "flex",
                alignItems: "center",
                gap: "12px"
              }}
            >
              {toast.type === "danger" && <AlertTriangle size={18} className="text-danger" />}
              {toast.type === "warning" && <AlertTriangle size={18} className="text-warning" />}
              {toast.type === "info" && <Info size={18} className="text-info" />}
              {toast.type === "success" && <CheckCircle2 size={18} className="text-success" />}
              
              <div style={{ fontSize: "13px", fontWeight: "500", color: "#1F2937", flexGrow: 1 }}>
                {toast.message}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
