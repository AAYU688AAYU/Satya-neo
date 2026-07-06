import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";
import { register } from "../../actions/authActions";
import { UserPlus, Shield } from "lucide-react";
import { motion } from "framer-motion";

function SignupScreen() {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userRegister = useSelector((state) => state.userRegister);
  const { loading, error, userInfo } = userRegister;

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      setMessage(null);
      dispatch(register(fname, lname, email, password));
    }
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "520px" }}
      >
        <Card className="card-premium border-0 p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "60px",
                height: "60px",
                backgroundColor: "rgba(11, 60, 120, 0.08)",
                color: "var(--color-primary)"
              }}
            >
              <UserPlus size={30} className="animate-pulse" />
            </div>
            <h2 className="mb-2" style={{ color: "var(--color-primary)", fontWeight: "700" }}>Register Account</h2>
            <p className="text-muted" style={{ fontSize: "14px" }}>Create your credentials to access the platform</p>
          </div>

          {message && <Message variant="danger">{message}</Message>}
          {error && <Message variant="danger">{error}</Message>}
          {loading && <div className="text-center py-2"><Loader /></div>}

          <Form onSubmit={submitHandler}>
            <Row>
              <Col md={6}>
                {/* First Name */}
                <div className="form-floating-premium">
                  <input
                    type="text"
                    id="fname"
                    placeholder="First Name"
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                    required
                  />
                  <label htmlFor="fname">First Name</label>
                </div>
              </Col>
              <Col md={6}>
                {/* Last Name */}
                <div className="form-floating-premium">
                  <input
                    type="text"
                    id="lname"
                    placeholder="Last Name"
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                    required
                  />
                  <label htmlFor="lname">Last Name</label>
                </div>
              </Col>
            </Row>

            {/* Email Address */}
            <div className="form-floating-premium">
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email Address</label>
            </div>

            {/* Password */}
            <div className="form-floating-premium">
              <input
                type="password"
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            {/* Confirm Password */}
            <div className="form-floating-premium">
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-premium btn-premium-primary w-100 text-white py-3 mt-2"
              style={{ borderRadius: "8px", fontWeight: "600", fontSize: "15px" }}
            >
              Initialize Profile
            </Button>
          </Form>

          <div className="text-center mt-4">
            <span className="text-muted" style={{ fontSize: "13px" }}>
              Already registered? <Link to="/login" style={{ color: "var(--color-secondary)", fontWeight: "600", textDecoration: "none" }}>Sign In</Link>
            </span>
          </div>
        </Card>
      </motion.div>
    </Container>
  );
}

export default SignupScreen;
