import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Satellite Image",
    description:
      "Acquire optical satellite imagery affected by cloud cover.",
  },
  {
    title: "AI Cloud Detection",
    description:
      "Identify cloud-covered regions using intelligent segmentation models.",
  },
  {
    title: "Multi-Source Fusion",
    description:
      "Combine SAR, historical observations and contextual Earth data.",
  },
  {
    title: "Cloud-Free Output",
    description:
      "Generate a reliable reconstructed Earth observation image.",
  },
];

function SolutionSection() {
  return (
    <section
      style={{
        background: "var(--color-background)",
        padding: "100px 0",
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <span
            style={{
              color: "var(--color-secondary)",
              fontWeight: "600",
              letterSpacing: "2px",
              fontSize: "12px",
              textTransform: "uppercase"
            }}
          >
            Processing Workflow
          </span>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              marginTop: "10px",
              fontFamily: "var(--font-secondary)"
            }}
          >
            How SATYA-EO Works
          </h2>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "10px auto 0" }}>
            Our AI-powered pipeline reconstructs cloud-covered satellite imagery using intelligent Earth Observation data fusion.
          </p>
        </div>

        <Row className="gy-4">
          {steps.map((step, index) => (
            <Col lg={3} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-100"
              >
                <Card className="card-premium h-100 border-0 text-center">
                  <div
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: "rgba(30, 136, 229, 0.1)",
                      color: "var(--color-secondary)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto 20px",
                      fontSize: "18px",
                      fontWeight: "700",
                      fontFamily: "var(--font-secondary)"
                    }}
                  >
                    {index + 1}
                  </div>
                  <h5 style={{ color: "var(--color-text)", fontWeight: "600" }}>{step.title}</h5>
                  <p className="text-muted m-0" style={{ fontSize: "14px", marginTop: "10px", lineHeight: "1.6" }}>
                    {step.description}
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

export default SolutionSection;