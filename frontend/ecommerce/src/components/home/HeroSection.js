import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Satellite, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

function HeroSection() {
  return (
    <section
      style={{
        minHeight: "90vh",
        background: "radial-gradient(ellipse at center, #0B2545 0%, #071B34 100%)",
        display: "flex",
        alignItems: "center",
        color: "white",
        padding: "80px 0"
      }}
    >
      <Container>
        <Row className="align-items-center gy-5">
          <Col lg={6}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span
                style={{
                  color: "var(--color-accent)",
                  fontWeight: "600",
                  letterSpacing: "3px",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  display: "block",
                  marginBottom: "10px"
                }}
              >
                AI Powered Earth Observation
              </span>

              <h1
                style={{
                  color: "#fff",
                  fontSize: "52px",
                  fontWeight: "800",
                  lineHeight: "1.2",
                  fontFamily: "var(--font-secondary)"
                }}
              >
                Beyond Cloud Removal
              </h1>

              <h3
                style={{
                  color: "#E2E8F0",
                  fontSize: "20px",
                  fontWeight: "400",
                  marginTop: "10px",
                  marginBottom: "25px",
                }}
              >
                Satellite-Assisted Trustworthy Earth Observation (SATYA-EO)
              </h3>

              <p
                style={{
                  color: "#94A3B8",
                  lineHeight: "1.9",
                  fontSize: "16px",
                  maxWidth: "500px"
                }}
              >
                SATYA-EO reconstructs cloud-occluded satellite imagery using multisource 
                sensor fusion (SAR & Optical) and custom neural pipelines, producing high-accuracy, 
                cloud-free analytical layers.
              </p>

              <div className="d-flex gap-3 mt-4">
                <Button
                  as={Link}
                  to="/dashboard"
                  className="btn-premium btn-premium-primary text-white"
                  style={{
                    background: "var(--color-secondary)",
                    borderColor: "var(--color-secondary)",
                    borderRadius: "30px",
                    padding: "12px 28px"
                  }}
                >
                  <Satellite size={16} /> Run Live Demo
                </Button>

                <Button
                  as="a"
                  href="#problem"
                  className="btn-premium btn-premium-outline text-white border-white"
                  style={{
                    borderRadius: "30px",
                    padding: "12px 28px"
                  }}
                >
                  Learn More <ArrowRight size={16} />
                </Button>
              </div>
            </motion.div>
          </Col>

          <Col lg={6} className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{
                position: "relative",
                borderRadius: "var(--radius-lg)",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900"
                alt="Earth Satellites Orbiting"
                className="img-fluid"
                style={{ filter: "brightness(0.95)" }}
              />
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default HeroSection;