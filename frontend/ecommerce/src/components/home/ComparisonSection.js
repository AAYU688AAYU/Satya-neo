import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { MoveRight } from "lucide-react";

function ComparisonSection() {
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
            Reconstruction Accuracy
          </span>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              marginTop: "10px",
              fontFamily: "var(--font-secondary)"
            }}
          >
            Before vs After AI Reconstruction
          </h2>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "10px auto 0" }}>
            Compare cloud-covered satellite imagery with SATYA-EO's AI reconstructed output.
          </p>
        </div>

        <Row className="gy-4 align-items-center">
          <Col lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="card-premium border-0 p-3">
                <img
                  src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900"
                  alt="Cloud Covered Sat Images"
                  className="img-fluid rounded"
                />
                <h5 style={{ color: "var(--color-text)", marginTop: "20px", textAlign: "center", fontWeight: "600" }}>
                  Cloud Occluded Feed
                </h5>
              </Card>
            </motion.div>
          </Col>

          <Col lg={2} className="d-flex justify-content-center align-items-center">
            <motion.div
              initial={{ scale: 0.8 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 100 }}
              className="text-secondary p-3 rounded-circle bg-light d-none d-lg-flex"
            >
              <MoveRight size={32} />
            </motion.div>
          </Col>

          <Col lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="card-premium border-0 p-3">
                <img
                  src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900"
                  alt="Cloud Free Sat Reconstruction"
                  className="img-fluid rounded"
                />
                <h5 style={{ color: "var(--color-primary)", marginTop: "20px", textAlign: "center", fontWeight: "600" }}>
                  AI Reconstructed Layer
                </h5>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ComparisonSection;