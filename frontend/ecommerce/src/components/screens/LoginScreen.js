import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../Loader";
import Message from "../Message";
import { login } from "../../actions/authActions";
import { Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard");
    }
  }, [userInfo, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  return (
    <Container className="py-5 d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: "100%", maxWidth: "460px" }}
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
              <Shield size={30} className="animate-pulse" />
            </div>
            <h2 className="mb-2" style={{ color: "var(--color-primary)", fontWeight: "700" }}>Portal Login</h2>
            <p className="text-muted" style={{ fontSize: "14px" }}>Access your Earth Observation pipeline dashboard</p>
          </div>

          {error && <Message variant="danger">{error}</Message>}
          {loading && <div className="text-center py-2"><Loader /></div>}

          <Form onSubmit={submitHandler}>
            {/* Email Address with Premium Floating label */}
            <div className="form-floating-premium">
              <input
                type="email"
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label htmlFor="email">Email Address / Username</label>
            </div>

            {/* Password with Premium Floating label */}
            <div className="form-floating-premium position-relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="password">Password</label>
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute bg-transparent border-0 text-muted"
                style={{ right: "14px", top: "22px", zIndex: 10 }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="btn-premium btn-premium-primary w-100 text-white py-3 mt-2"
              style={{ borderRadius: "8px", fontWeight: "600", fontSize: "15px" }}
            >
              Authenticate Identity
            </Button>
          </Form>

          <div className="text-center mt-4">
            <span className="text-muted" style={{ fontSize: "13px" }}>
              New to SATYA-EO? <Link to="/signup" style={{ color: "var(--color-secondary)", fontWeight: "600", textDecoration: "none" }}>Create credentials</Link>
            </span>
          </div>
        </Card>
      </motion.div>
    </Container>
  );
}

export default LoginScreen;
