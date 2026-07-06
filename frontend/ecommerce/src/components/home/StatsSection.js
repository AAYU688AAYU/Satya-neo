import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const stats = [
  {
    number: "95%",
    title: "Cloud Removal Accuracy",
    description:
      "Advanced AI reconstructs cloud-covered satellite imagery with high precision.",
  },
  {
    number: "15+",
    title: "Earth Observation Sources",
    description:
      "Supports multispectral satellite imagery from multiple EO platforms.",
  },
  {
    number: "24/7",
    title: "Near Real-Time",
    description:
      "Fast image processing for emergency response and continuous monitoring.",
  },
  {
    number: "6+",
    title: "Use Cases",
    description:
      "Agriculture, Disaster Management, Environment, Climate and Urban Planning.",
  },
];

function StatsSection() {
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
            Capabilities
          </span>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              marginTop: "10px",
              fontFamily: "var(--font-secondary)"
            }}
          >
            Trusted Earth Observation Platform
          </h2>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "10px auto 0" }}>
            Delivering intelligent cloud-free satellite imagery powered by AI models.
          </p>
        </div>

        <Row className="gy-4">
          {stats.map((item, index) => (
            <Col lg={3} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-100"
              >
                <Card className="card-premium h-100 border-0">
                  <h1
                    style={{
                      color: "var(--color-secondary)",
                      fontWeight: "700",
                      fontFamily: "var(--font-secondary)",
                      marginBottom: "10px"
                    }}
                  >
                    {item.number}
                  </h1>
                  <h5 style={{ color: "var(--color-text)", fontWeight: "600" }}>{item.title}</h5>
                  <p className="text-muted m-0" style={{ fontSize: "14px", marginTop: "10px", lineHeight: "1.6" }}>
                    {item.description}
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

export default StatsSection;