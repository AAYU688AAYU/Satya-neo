import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Globe, ShieldAlert, Award } from "lucide-react";

function Footer() {
  return (
    <footer
      style={{
        background: "#071B34", /* Matching dark portal theme */
        color: "#CBD5E1",
        padding: "60px 0 30px",
        borderTop: "3px solid var(--color-primary)",
        fontSize: "14px",
      }}
    >
      <Container>
        <Row className="gy-4">
          <Col lg={5} className="mb-4">
            <h3
              style={{
                color: "#FFFFFF",
                fontWeight: "700",
                fontFamily: "var(--font-secondary)",
                letterSpacing: "0.5px",
                marginBottom: "15px"
              }}
            >
              SATYA-EO
            </h3>
            <p
              style={{
                color: "#94A3B8",
                lineHeight: "1.8",
                maxWidth: "400px"
              }}
            >
              SATYA-EO is an enterprise-grade AI-powered Earth Observation platform, 
              providing advanced analytics, intelligent cloud removal, and multisource satellite data fusion 
              for governmental, military, agricultural, and research applications.
            </p>
          </Col>

          <Col sm={6} lg={3} className="mb-4">
            <h5 className="text-white mb-3" style={{ fontFamily: "var(--font-secondary)" }}>Quick Access</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
              <li>
                <Link to="/" style={{ color: "#94A3B8", textDecoration: "none" }} className="hover-white">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link to="/dashboard" style={{ color: "#94A3B8", textDecoration: "none" }}>
                  Observation Dashboard
                </Link>
              </li>
              <li>
                <a href="#!" style={{ color: "#94A3B8", textDecoration: "none" }}>
                  Documentation & APIs
                </a>
              </li>
              <li>
                <a href="#!" style={{ color: "#94A3B8", textDecoration: "none" }}>
                  Developer Portal
                </a>
              </li>
            </ul>
          </Col>

          <Col sm={6} lg={4} className="mb-4">
            <h5 className="text-white mb-3" style={{ fontFamily: "var(--font-secondary)" }}>Resources & Compliance</h5>
            <div className="d-flex flex-column gap-2">
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
                <Award size={16} className="text-secondary" />
                <span>National Hackathon Showcase</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
                <Globe size={16} className="text-secondary" />
                <span>Sentinel-1/2 SAR & Optical Fusion</span>
              </div>
              <div className="d-flex align-items-center gap-2 text-muted" style={{ fontSize: "13px" }}>
                <ShieldAlert size={16} className="text-secondary" />
                <span>Secure Government-Grade Portal</span>
              </div>
            </div>
          </Col>
        </Row>

        <hr
          style={{
            borderColor: "rgba(255, 255, 255, 0.1)",
            margin: "30px 0"
          }}
        />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <div style={{ color: "#94A3B8", fontSize: "13px" }}>
            © 2026 SATYA-EO | Satellite Assisted Trustworthy Earth Observation Platform. All rights reserved.
          </div>
          <div className="d-flex gap-4" style={{ fontSize: "13px" }}>
            <a href="#!" style={{ color: "#94A3B8", textDecoration: "none" }}>Privacy Policy</a>
            <a href="#!" style={{ color: "#94A3B8", textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;