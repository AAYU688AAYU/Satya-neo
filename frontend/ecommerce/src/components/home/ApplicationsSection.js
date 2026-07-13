import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

const applications = [
  {
    title: "Agriculture",
    icon: "🌾",
    description:
      "Monitor crop health, irrigation planning and agricultural productivity.",
  },
  {
    title: "Disaster Management",
    icon: "🚨",
    description:
      "Support rapid emergency response during floods, landslides and cyclones.",
  },
  {
    title: "Climate & Environment",
    icon: "🌍",
    description:
      "Track environmental changes and climate impact with cloud-free imagery.",
  },
  {
    title: "Forest Monitoring",
    icon: "🌳",
    description:
      "Detect deforestation, illegal activities and ecosystem degradation.",
  },
  {
    title: "Urban Planning",
    icon: "🏙️",
    description:
      "Enable infrastructure planning using accurate satellite observations.",
  },
  {
    title: "Water & Flood Intelligence",
    icon: "🌊",
    description:
      "Monitor rivers, reservoirs and flood-prone regions in near real time.",
  },
];

function ApplicationsSection() {
  return (
    <section
      id="applications"
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
            Sectors & Impact
          </span>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              marginTop: "10px",
              fontFamily: "var(--font-secondary)"
            }}
          >
            Real World Applications
          </h2>
          <p className="text-muted" style={{ maxWidth: "600px", margin: "10px auto 0" }}>
            SATYA-EO provides reliable Earth Observation data for governments, researchers, industries and disaster response agencies.
          </p>
        </div>

        <Row className="gy-4">
          {applications.map((app, index) => (
            <Col lg={4} md={6} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-100"
              >
                <Card className="card-premium h-100 border-0">
                  <div
                    style={{
                      fontSize: "40px",
                      marginBottom: "15px",
                    }}
                  >
                    {app.icon}
                  </div>
                  <h4 style={{ color: "var(--color-text)", fontWeight: "600" }}>{app.title}</h4>
                  <p className="text-muted m-0" style={{ fontSize: "14px", marginTop: "10px", lineHeight: "1.7" }}>
                    {app.description}
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

export default ApplicationsSection;