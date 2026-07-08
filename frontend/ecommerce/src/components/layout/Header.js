import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/authActions";
import logo from "../../assets/images/satya-logo.png";
import { Search, Bell, Settings, Sun, Moon, LogOut, LayoutDashboard } from "lucide-react";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [darkTheme, setDarkTheme] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/dashboard?search=${searchVal}`);
    }
  };

  return (
    <Navbar
      expand="lg"
      className="glass-header sticky-top py-2"
      variant="light"
    >
      <Container>
        {/* Left: Brand logo & name */}
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center"
          style={{ cursor: "pointer" }}
        >
          <img
            src={logo}
            alt="SATYA-EO"
            style={{
              height: "46px",
              width: "auto",
              objectFit: "contain",
            }}
          />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbar-nav" />

        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          {/* Middle: Professional navigation links */}
          <Nav className="mx-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className="px-3"
              style={{
                fontFamily: "var(--font-secondary)",
                fontWeight: "500",
                fontSize: "14px",
                color: "var(--color-text)",
              }}
            >
              Home
            </Nav.Link>

            <Nav.Link
              as={Link}
              to="/dashboard"
              className="px-3 d-flex align-items-center gap-2"
              style={{
                fontFamily: "var(--font-secondary)",
                fontWeight: "500",
                fontSize: "14px",
                color: "var(--color-text)",
              }}
            >
              <LayoutDashboard size={16} className="text-secondary" />
              Dashboard
            </Nav.Link>
          </Nav>

          {/* Right side controls */}
          <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="position-relative d-none d-xl-block">
              <input
                type="text"
                placeholder="Search datasets, reports..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                style={{
                  padding: "8px 16px 8px 38px",
                  fontSize: "13px",
                  borderRadius: "20px",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "rgba(0, 0, 0, 0.02)",
                  outline: "none",
                  width: "220px",
                  transition: "var(--transition-fast)"
                }}
                onFocus={(e) => {
                  e.target.style.width = "280px";
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.borderColor = "var(--color-secondary)";
                }}
                onBlur={(e) => {
                  e.target.style.width = "220px";
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.02)";
                  e.target.style.borderColor = "var(--color-border)";
                }}
              />
              <Search
                size={15}
                className="position-absolute text-muted"
                style={{ left: "14px", top: "11px" }}
              />
            </form>

            {/* Notifications icon */}
            <button
              className="btn-premium btn-premium-ghost p-2 rounded-circle position-relative"
              style={{ width: "38px", height: "38px" }}
              title="Notifications"
            >
              <Bell size={18} className="text-dark" />
              <span
                className="position-absolute bg-danger rounded-circle"
                style={{
                  width: "7px",
                  height: "7px",
                  top: "8px",
                  right: "8px"
                }}
              />
            </button>

            {/* Theme Toggle */}
            <button
              className="btn-premium btn-premium-ghost p-2 rounded-circle"
              style={{ width: "38px", height: "38px" }}
              onClick={() => setDarkTheme(!darkTheme)}
              title="Theme Toggle"
            >
              {darkTheme ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Settings */}
            <button
              className="btn-premium btn-premium-ghost p-2 rounded-circle"
              style={{ width: "38px", height: "38px" }}
              title="Settings"
              onClick={() => navigate("/dashboard")}
            >
              <Settings size={18} />
            </button>

            {/* User Profile Menu */}
            {userInfo ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  style={{ cursor: "pointer" }}
                  className="d-flex align-items-center gap-2"
                >
                  <div
                    className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle font-weight-bold"
                    style={{
                      width: "36px",
                      height: "36px",
                      fontSize: "14px",
                      backgroundColor: "var(--color-primary)"
                    }}
                  >
                    {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="border-0 shadow-lg mt-2 p-2" style={{ borderRadius: "12px" }}>
                  <div className="px-3 py-2 border-bottom mb-2">
                    <div style={{ fontWeight: "600", fontSize: "14px" }}>{userInfo.name}</div>
                    <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>{userInfo.email}</div>
                  </div>
                  <Dropdown.Item
                    as={Link}
                    to="/dashboard"
                    className="d-flex align-items-center gap-2 py-2"
                    style={{ fontSize: "14px" }}
                  >
                    <LayoutDashboard size={15} /> Dashboard
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={logoutHandler}
                    className="d-flex align-items-center gap-2 py-2 text-danger"
                    style={{ fontSize: "14px" }}
                  >
                    <LogOut size={15} /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button
                  as={Link}
                  to="/login"
                  variant="outline-primary"
                  className="btn-premium btn-premium-secondary"
                  style={{ padding: "6px 18px", fontSize: "13px" }}
                >
                  Sign In
                </Button>
                <Button
                  as={Link}
                  to="/signup"
                  className="btn-premium btn-premium-primary"
                  style={{ padding: "6px 18px", fontSize: "13px" }}
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;