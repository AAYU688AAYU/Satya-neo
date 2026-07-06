import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

function DashboardPreview() {
  return (
    <section
      style={{
        background: "var(--color-background)",
        padding: "110px 0",
      }}
    >
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={5}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <span
                style={{
                  color: "var(--color-secondary)",
                  fontWeight: "600",
                  letterSpacing: "2px",
                  fontSize: "12px",
                  textTransform: "uppercase"
                }}
              >
                Live Demonstration
              </span>

              <h2
                style={{
                  color: "var(--color-primary)",
                  fontWeight: "700",
                  marginTop: "10px",
                  fontFamily: "var(--font-secondary)"
                }}
              >
                AI Cloud Removal Dashboard
              </h2>

              <p
                style={{
                  color: "var(--color-text-muted)",
                  lineHeight: "1.9",
                  marginTop: "20px",
                }}
              >
                Upload GeoTIFF satellite imagery, visualize cloud segmentation, 
                compare reconstruction models, track NDVI vegetative values, 
                and compile automated reports in one unified secure dashboard.
              </p>

              <Button
                as={Link}
                to="/dashboard"
                className="btn-premium btn-premium-primary text-white"
                style={{
                  borderRadius: "30px",
                  padding: "12px 30px",
                  marginTop: "20px",
                }}
              >
                <Sparkles size={16} /> Open Dashboard Demo
              </Button>
            </motion.div>
          </Col>

          <Col lg={7}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                background: "white",
                borderRadius: "var(--radius-lg)",
                padding: "15px",
                border: "1px solid rgba(0,0,0,.08)",
                boxShadow: "var(--shadow-large)"
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1400"
                alt="Dashboard Mockup Preview"
                className="img-fluid rounded"
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default DashboardPreview;