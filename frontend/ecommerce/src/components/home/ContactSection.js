import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", email: "", org: "", msg: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", org: "", msg: "" });
      alert("Inquiry successfully delivered! A representative from our Earth Observation Operations center will follow up within 24 hours.");
    }, 800);
  };

  return (
    <section
      id="contact"
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
            GET IN TOUCH
          </span>
          <h2
            className="mb-3"
            style={{
              color: "var(--color-primary)",
              fontWeight: "700",
              fontSize: "36px"
            }}
          >
            Contact Operations Control
          </h2>
          <p className="text-muted" style={{ fontSize: "16px", lineHeight: "1.8" }}>
            Have a custom research request or need enterprise API keys? Submit your credentials to query our GIS desk.
          </p>
        </div>

        <Row className="gy-5">
          <Col lg={5}>
            <div className="d-flex flex-column gap-4 h-100 justify-content-center">
              <Card className="border-0 p-4 shadow-sm" style={{ backgroundColor: "#f8fafc", borderRadius: "16px" }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-3 bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm text-secondary"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <Mail size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>Operations Desk</h5>
                    <a href="mailto:ops@satya-eo.in" style={{ color: "var(--color-text-muted)", textDecoration: "none", fontSize: "14px" }}>
                      ops@satya-eo.in
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="border-0 p-4 shadow-sm" style={{ backgroundColor: "#f8fafc", borderRadius: "16px" }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-3 bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm text-success"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <Phone size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>Call Operations</h5>
                    <a href="tel:+912912439000" style={{ color: "var(--color-text-muted)", textDecoration: "none", fontSize: "14px" }}>
                      +91 291 243 9000
                    </a>
                  </div>
                </div>
              </Card>

              <Card className="border-0 p-4 shadow-sm" style={{ backgroundColor: "#f8fafc", borderRadius: "16px" }}>
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="p-3 bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm text-warning"
                    style={{ width: "48px", height: "48px" }}
                  >
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h5 className="mb-1" style={{ fontSize: "15px", fontWeight: "700" }}>EO Headquarter</h5>
                    <div style={{ color: "var(--color-text-muted)", fontSize: "14px", lineHeight: "1.5" }}>
                      Satellite Application Area, Jodhpur, Rajasthan, India
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </Col>

          <Col lg={7}>
            <Card
              className="border-0 p-4 p-md-5"
              style={{
                background: "#f8fafc",
                borderRadius: "20px"
              }}
            >
              <Form onSubmit={handleSubmit}>
                <Row className="gy-4">
                  <Col md={6}>
                    <Form.Group className="form-floating-premium">
                      <Form.Control
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={{ border: "1px solid var(--color-border)" }}
                      />
                      <label>Full Name</label>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="form-floating-premium">
                      <Form.Control
                        type="email"
                        placeholder="Your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={{ border: "1px solid var(--color-border)" }}
                      />
                      <label>Email Address</label>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="form-floating-premium">
                      <Form.Control
                        type="text"
                        placeholder="Agency / Organization"
                        value={formData.org}
                        onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                        style={{ border: "1px solid var(--color-border)" }}
                      />
                      <label>Agency / Organization</label>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group className="form-floating-premium">
                      <Form.Control
                        as="textarea"
                        rows={4}
                        placeholder="Enter message details..."
                        value={formData.msg}
                        onChange={(e) => setFormData({ ...formData, msg: e.target.value })}
                        required
                        style={{
                          height: "120px",
                          border: "1px solid var(--color-border)",
                          paddingTop: "24px"
                        }}
                      />
                      <label>Message Details</label>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Button
                      type="submit"
                      disabled={submitted}
                      className="btn-premium btn-premium-primary text-white w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                      style={{
                        background: "var(--color-primary)",
                        borderRadius: "10px",
                        fontWeight: "600",
                        fontSize: "15px"
                      }}
                    >
                      {submitted ? "Delivering..." : "Submit Inquiry"} <Send size={15} />
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
