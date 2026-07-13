import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Cpu, Binary, BarChart3, Database } from "lucide-react";
import { motion } from "framer-motion";

export default function ResearchSection() {
  const researchItems = [
    {
      icon: <Cpu size={26} className="text-secondary" />,
      title: "Attention Transformers",
      desc: "Deploying self-attention heads that calculate spatial-spectral dependencies across multiple satellite bands simultaneously, ensuring pixel reconstruction is physically coherent."
    },
    {
      icon: <Binary size={26} className="text-success" />,
      title: "Temporal GANs",
      desc: "Using generative adversarial structures that ingest chronological imagery histories to reconstruct obscured regions matching seasonal vegetation progressions."
    },
    {
      icon: <BarChart3 size={26} className="text-warning" />,
      title: "Fidelity Benchmarks",
      desc: "Our neural reconstructors achieve superior performance with average PSNR ratings exceeding 32.4 dB and Structural Similarity (SSIM) marks above 0.94."
    },
    {
      icon: <Database size={26} className="text-danger" />,
      title: "Multisource Telemetry",
      desc: "Integrating Sentinel-1 (C-band SAR microwave), Sentinel-2 (optical multi-spectral), and Landsat-8 payloads into unified input arrays for complete sensor fusion."
    }
  ];

  return (
    <section
      id="research"
      className="py-6"
      style={{
        background: "#ffffff",
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
            RESEARCH & MODELING
          </span>
          <h2
            className="mb-3"
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              fontSize: "36px"
            }}
          >
            Under the Hood of SATYA-EO
          </h2>
          <p className="text-muted" style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Our deep learning frameworks are custom-tailored for Earth Observation challenges, combining physical 
            radiometric models with advanced computer vision architectures.
          </p>
        </div>

        <Row className="gy-4">
          {researchItems.map((item, idx) => (
            <Col key={idx} lg={6}>
              <motion.div
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card
                  className="card-premium border-0 p-4"
                  style={{
                    backgroundColor: "#f8fafc",
                    transition: "all 0.2s ease-in-out"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-medium)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "var(--shadow-subtle)";
                  }}
                >
                  <div className="d-flex align-items-start gap-4">
                    <div
                      className="p-3 bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: "52px", height: "52px", flexShrink: 0 }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="mb-2" style={{ fontSize: "18px", fontWeight: "700" }}>
                        {item.title}
                      </h4>
                      <p className="text-muted mb-0" style={{ fontSize: "14px", lineHeight: "1.7" }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
