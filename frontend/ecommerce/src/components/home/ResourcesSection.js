import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FileText, Download, Terminal, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function ResourcesSection() {
  const resources = [
    {
      icon: <Download size={22} className="text-secondary" />,
      title: "Sample Rasters",
      type: "GeoTIFF Bundle (180 MB)",
      desc: "Raw Sentinel-2 tiles alongside cloud-inpainted outputs covering various agricultural and mountainous test sites."
    },
    {
      icon: <Terminal size={22} className="text-success" />,
      title: "Python SDK / CLI",
      type: "Pip Package v1.2.0",
      desc: "Automate model pipeline inferences, coordinate parsing, and raster exports directly from your terminal console."
    },
    {
      icon: <FileText size={22} className="text-warning" />,
      title: "REST API Docs",
      type: "Swagger Spec Reference",
      desc: "Developer endpoints details for authenticating, uploading GeoTIFF streams, and tracking predictive workers."
    },
    {
      icon: <BookOpen size={22} className="text-danger" />,
      title: "User Handbooks",
      type: "PDF User Guides",
      desc: "Complete operational instructions explaining GIS mapping controls, split reveals, and NDVI analyses."
    }
  ];

  return (
    <section
      id="resources"
      className="py-6"
      style={{
        background: "var(--color-background)",
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
            DEVELOPER RESOURCES
          </span>
          <h2
            className="mb-3"
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              fontSize: "36px"
            }}
          >
            GIS Tools & SDKs
          </h2>
          <p className="text-muted" style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Integrate SATYA-EO data streams straight into local pipelines, QGIS platforms, or custom software suites.
          </p>
        </div>

        <Row className="gy-4 align-items-center">
          <Col lg={7}>
            <Row className="gy-4">
              {resources.map((res, idx) => (
                <Col key={idx} md={6}>
                  <Card
                    className="card-premium h-100 border-0 p-4"
                    style={{
                      backgroundColor: "white",
                      transition: "all 0.2s ease-in-out"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "var(--shadow-medium)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "var(--shadow-subtle)";
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div className="p-2.5 bg-light rounded-lg d-inline-flex align-items-center justify-content-center">
                        {res.icon}
                      </div>
                      <span
                        className="text-muted"
                        style={{ fontSize: "11px", fontWeight: "600", letterSpacing: "0.5px" }}
                      >
                        {res.type}
                      </span>
                    </div>
                    <h4 className="mb-2" style={{ fontSize: "16px", fontWeight: "700" }}>
                      {res.title}
                    </h4>
                    <p className="text-muted mb-3" style={{ fontSize: "13px", lineHeight: "1.6" }}>
                      {res.desc}
                    </p>
                    <Button
                      variant="link"
                      className="p-0 text-left d-flex align-items-center gap-1 mt-auto"
                      style={{
                        color: "var(--color-secondary)",
                        fontWeight: "600",
                        fontSize: "13px",
                        textDecoration: "none"
                      }}
                      onClick={() => alert(`${res.title} download simulation initiated!`)}
                    >
                      Access Asset <Download size={13} />
                    </Button>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>

          <Col lg={5}>
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-xl text-white shadow-lg"
              style={{
                background: "#071B34",
                border: "1px solid rgba(255, 255, 255, 0.08)"
              }}
            >
              <div className="d-flex align-items-center gap-2 mb-3">
                <div
                  className="rounded-circle bg-danger"
                  style={{ width: "10px", height: "10px" }}
                />
                <div
                  className="rounded-circle bg-warning"
                  style={{ width: "10px", height: "10px" }}
                />
                <div
                  className="rounded-circle bg-success"
                  style={{ width: "10px", height: "10px" }}
                />
                <span className="text-muted ms-2" style={{ fontSize: "11px", fontFamily: "monospace" }}>
                  bash - SDK Installation
                </span>
              </div>
              <pre
                style={{
                  fontFamily: "monospace",
                  fontSize: "13px",
                  color: "#38BDF8",
                  margin: 0,
                  overflowX: "auto"
                }}
              >
                <code>
                  {`# Install the SATYA-EO developer SDK
$ pip install satya-eo-sdk

# Authenticate local profile credential keys
$ satya-eo login --key_id s_9348f2c

# Pull latest cloud-free Sentinel-2 inference
$ satya-eo pull --lat 26.2389 --lng 73.0243 --days 30

[INFO] Fetching multitemporal SAR tiles...
[INFO] Resolving cross-attention layers...
[INFO] Cloud-free reconstruction complete!
[SUCCESS] Exported: ./jodhpur_composite.tif`}
                </code>
              </pre>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
