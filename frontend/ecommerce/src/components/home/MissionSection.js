import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Shield, Sparkles, Network } from "lucide-react";
import { motion } from "framer-motion";

export default function MissionSection() {
  const cards = [
    {
      icon: <Network size={28} className="text-secondary" />,
      title: "SAR-Optical Fusion",
      desc: "By combining all-weather synthetic aperture radar (SAR) returns with multi-spectral optical bands, we reconstruct missing pixel grids through atmospheric obstructions."
    },
    {
      icon: <Shield size={28} className="text-success" />,
      title: "Scientific Integrity",
      desc: "Every reconstructed raster undergoes rigorous validation audits, maintaining precise Coordinate Reference System (CRS) alignments and pixel-level spectral fidelity."
    },
    {
      icon: <Sparkles size={28} className="text-warning" />,
      title: "Actionable Insights",
      desc: "From crop yield tracking and urban sprawl classification to maritime navigation and disaster relief support, we transform raw satellite data into vector intelligence."
    }
  ];

  return (
    <section
      id="mission"
      className="py-6"
      style={{
        background: "#ffffff",
        position: "relative",
        borderBottom: "1px solid var(--color-border)"
      }}
    >
      <Container>
        <div className="text-center mb-5 max-w-xl mx-auto">
          <span
            style={{
              color: "var(--color-secondary)",
              fontWeight: "600",
              letterSpacing: "2px",
              fontSize: "12px",
              textTransform: "uppercase",
              display: "block",
              marginBottom: "8px"
            }}
          >
            OUR MISSION
          </span>
          <h2
            className="mb-3"
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              fontSize: "36px"
            }}
          >
            Clear, Trustworthy Earth Observation
          </h2>
          <p className="text-muted" style={{ fontSize: "16px", lineHeight: "1.8" }}>
            To deliver clean, actionable, and verified satellite analytics globally, bypassing weather limitations 
            and sensor noise through modern deep learning and multisource telemetry.
          </p>
        </div>

        <Row className="gy-4 mt-2">
          {cards.map((card, idx) => (
            <Col key={idx} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="h-100"
              >
                <Card
                  className="card-premium h-100 border-0 p-4"
                  style={{
                    backgroundColor: "#f8fafc",
                    transition: "all 0.2s ease-in-out"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-medium)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "var(--shadow-subtle)";
                  }}
                >
                  <div
                    className="p-3 bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
                    style={{ width: "56px", height: "56px" }}
                  >
                    {card.icon}
                  </div>
                  <h4 className="mb-2" style={{ fontSize: "18px", fontWeight: "700" }}>
                    {card.title}
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                    {card.desc}
                  </p>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
