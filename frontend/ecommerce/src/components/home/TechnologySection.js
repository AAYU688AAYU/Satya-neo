import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

const pipeline = [
  "Satellite Image",
  "Cloud Detection",
  "Data Fusion",
  "AI Reconstruction",
  "Cloud-Free Output",
  "Web Dashboard",
];

function TechnologySection() {
  return (
    <section
      style={{
        background: "#FFFFFF",
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
            Engineering
          </span>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              marginTop: "10px",
              fontFamily: "var(--font-secondary)"
            }}
          >
            Technology Architecture
          </h2>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "10px auto 0" }}>
            SATYA-EO combines Artificial Intelligence, Earth Observation data, and cloud reconstruction models into one intelligent pipeline.
          </p>
        </div>

        <Row className="justify-content-center align-items-center gy-4">
          {pipeline.map((step, index) => (
            <React.Fragment key={index}>
              <Col lg={2} md={4} sm={6} className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.08 }}
                >
                  <Card
                    className="card-premium border-0"
                    style={{
                      padding: "25px 15px",
                      minHeight: "120px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: "600",
                      fontSize: "14px",
                      color: "var(--color-primary)",
                      boxShadow: "var(--shadow-subtle)"
                    }}
                  >
                    {step}
                  </Card>
                </motion.div>
              </Col>

              {index !== pipeline.length - 1 && (
                <Col
                  lg={1}
                  className="d-none d-lg-flex justify-content-center align-items-center text-secondary"
                >
                  <MoveRight size={20} />
                </Col>
              )}
            </React.Fragment>
          ))}
        </Row>
      </Container>
    </section>
  );
}

export default TechnologySection;