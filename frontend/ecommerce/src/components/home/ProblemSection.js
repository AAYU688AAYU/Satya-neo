import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { AlertTriangle, Clock, Compass } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    title: "Cloud Obstruction",
    icon: <AlertTriangle size={24} className="text-danger" />,
    description:
      "More than 60% of optical satellite images are partially or fully blocked by clouds, reducing their usability.",
  },
  {
    title: "Delayed Decision Making",
    icon: <Clock size={24} className="text-warning" />,
    description:
      "Incomplete satellite observations delay disaster response, crop monitoring and environmental assessment.",
  },
  {
    title: "Loss of Critical Information",
    icon: <Compass size={24} className="text-info" />,
    description:
      "Traditional cloud masking removes valuable information instead of reconstructing the hidden surface.",
  },
];

function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        background: "#FFFFFF",
        padding: "100px 0",
      }}
    >
      <Container>
        <div className="text-center mb-5">
          <span
            style={{
              color: "var(--color-danger)",
              fontWeight: "600",
              letterSpacing: "2px",
              fontSize: "12px",
              textTransform: "uppercase"
            }}
          >
            The Challenge
          </span>
          <h2
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              marginTop: "10px",
              fontFamily: "var(--font-secondary)"
            }}
          >
            The Problem We Solve
          </h2>
          <p
            className="text-muted"
            style={{
              maxWidth: "600px",
              margin: "10px auto 0",
            }}
          >
            Cloud-covered satellite imagery limits accurate Earth observation,
            making critical decisions slower and less reliable.
          </p>
        </div>

        <Row className="gy-4">
          {problems.map((item, index) => (
            <Col md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-100"
              >
                <Card className="card-premium h-100 border-0">
                  <div
                    className="p-2.5 rounded-circle d-inline-flex mb-3"
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "rgba(0,0,0,0.02)",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    {item.icon}
                  </div>
                  <h4
                    style={{
                      color: "var(--color-primary)",
                      fontWeight: "600",
                      marginBottom: "15px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-muted m-0" style={{ fontSize: "14px", lineHeight: "1.7" }}>
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

export default ProblemSection;