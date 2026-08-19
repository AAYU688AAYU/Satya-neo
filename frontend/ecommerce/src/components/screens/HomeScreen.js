import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Cloud, Cpu, Database, FileImage, Map, Play, Upload, Zap } from "lucide-react";
import cloudyImg from "../../assets/images/cloudy.png";
import cloudfreeImg from "../../assets/images/cloudfree.png";
import "./HomeScreen.css";

function HomeScreen() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(52);
  const [model, setModel] = useState("Nimbus v2");

  const handleFile = (file) => {
    if (file) setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files[0]);
  };

  return (
    <main className="satya-home">
      <section className="satya-hero" id="hero">
        <div className="satya-orbit satya-orbit-one" /><div className="satya-orbit satya-orbit-two" />
        <div className="satya-hero-grid">
          <div className="satya-hero-copy">
            <p className="satya-kicker"><span className="satya-live-dot" /> SATYA-EO / EARTH OBSERVATION AI</p>
            <h1>See through the weather.</h1>
            <p className="satya-hero-lede">Recover clear, analysis-ready satellite scenes from cloud-obscured imagery with models built for the signal beneath.</p>
            <div className="satya-hero-actions"><button className="satya-button satya-button-bright" onClick={() => fileInputRef.current?.click()}><Upload size={16} /> Start with an image</button><Link className="satya-text-link" to="/dashboard">Open workspace <ArrowRight size={16} /></Link></div>
            <div className="satya-trust-row"><span><Check size={14} /> GeoTIFF ready</span><span><Check size={14} /> 10 m native output</span><span><Check size={14} /> No training data retained</span></div>
          </div>
          <div className="satya-hero-console" id="home">
            <div className="satya-console-top"><span className="satya-console-label"><span className="satya-status-dot" /> LIVE PREVIEW</span><span>SCENE / 04-928</span></div>
            <div className="satya-scene-preview"><img src={cloudfreeImg} alt="AI reconstructed satellite scene" /><div className="satya-cloud-layer" style={{ width: `${sliderPosition}%` }}><img src={cloudyImg} alt="Cloud-obscured satellite scene" /></div><div className="satya-split-line" style={{ left: `${sliderPosition}%` }}><span>↔</span></div><span className="satya-scene-tag satya-scene-tag-before">SOURCE / CLOUDY</span><span className="satya-scene-tag satya-scene-tag-after">PREDICTED / CLEAR</span></div>
            <div className="satya-console-controls"><span>Drag to compare</span><input aria-label="Compare source and prediction" type="range" min="8" max="92" value={sliderPosition} onChange={(event) => setSliderPosition(event.target.value)} /><span>{sliderPosition}%</span></div>
            <div className="satya-console-meta"><span><Map size={14} /> Rajasthan, IN</span><span><Database size={14} /> Sentinel-2</span><span><span className="satya-confidence">98.4%</span> confidence</span></div>
          </div>
        </div>
      </section>
      <section className="satya-workbench" id="mission"><div className="satya-section-heading"><div><p className="satya-eyebrow">01 / BUILD A SCENE</p><h2>From raw capture to clear signal.</h2></div><p>One focused workflow for teams working with optical satellite data, seasonal change, and decisions that cannot wait for a cloudless day.</p></div><div className="satya-workbench-grid"><div className="satya-upload-panel" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} role="button" tabIndex="0" onKeyDown={(event) => event.key === "Enter" && fileInputRef.current?.click()}><input ref={fileInputRef} className="satya-hidden-input" type="file" accept=".tif,.tiff,.png,.jpg,.jpeg" onChange={(event) => handleFile(event.target.files[0])} /><div className="satya-upload-icon"><FileImage size={22} /></div><p className="satya-panel-label">DROP YOUR CAPTURE HERE</p><h3>{selectedFile ? selectedFile.name : "Upload a satellite image"}</h3><p>{selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB ready for inference` : "GeoTIFF, TIFF, PNG, or JPEG up to 500 MB"}</p><span className="satya-upload-link">Browse files <ArrowRight size={15} /></span></div><div className="satya-settings-panel"><div className="satya-panel-label">MODEL CONFIGURATION</div><label htmlFor="model">Reconstruction model</label><div className="satya-select-wrap"><select id="model" value={model} onChange={(event) => setModel(event.target.value)}><option>Nimbus v2</option><option>Monsoon v1.4</option><option>Rapid preview</option></select><ChevronDown size={16} /></div><div className="satya-setting-row"><span>Cloud coverage</span><strong>34%</strong></div><div className="satya-setting-bar"><span /></div><div className="satya-setting-row"><span>Expected output</span><strong>10 m / RGB + NIR</strong></div><button className="satya-button satya-button-dark" onClick={(event) => { event.stopPropagation(); fileInputRef.current?.click(); }}><Play size={15} /> Run a prediction</button></div></div></section>
      <section className="satya-metrics" id="applications"><div className="satya-metric"><Cloud size={21} /><strong>38%</strong><span>of optical scenes lose visibility to clouds</span></div><div className="satya-metric"><Cpu size={21} /><strong>4.2 min</strong><span>median reconstruction for a 512 MB scene</span></div><div className="satya-metric"><Zap size={21} /><strong>12 bands</strong><span>preserved for downstream analysis</span></div></section>
      <section className="satya-bottom-band" id="research"><div><p className="satya-eyebrow">02 / READY FOR THE NEXT QUESTION</p><h2>Clearer imagery makes better maps.</h2></div><div className="satya-bottom-copy"><p>Inspect vegetation, water, roads, and land cover without waiting for a perfect pass. Every prediction keeps its provenance, confidence map, and original geometry.</p><Link className="satya-button satya-button-bright" to="/dashboard">Explore the workspace <ArrowRight size={16} /></Link></div></section>
      <footer className="satya-footer" id="contact"><span>© 2026 SATYA-EO</span><span>AI FOR A CLEARER EARTH</span><span>Built for researchers, planners, and the field.</span></footer>
    </main>
  );
}

export default HomeScreen;