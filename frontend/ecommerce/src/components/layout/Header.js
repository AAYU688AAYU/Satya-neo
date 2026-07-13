import React, { useState, useEffect } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/authActions";
import logo from "../../assets/images/satya-logo.png";
import { Search, Bell, Settings, Sun, Moon, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [darkTheme, setDarkTheme] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const logoutHandler = () => {
    dispatch(logout());
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      setMobileMenuOpen(false);
      navigate(`/dashboard?search=${searchVal}`);
    }
  };

  // Scroll detection for height transition and theme shift
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer to highlight active link
  useEffect(() => {
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sections = ["home", "mission", "applications", "research", "resources", "contact"];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: "-40% 0px -50% 0px", // triggers when section is in the upper middle
      threshold: 0
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = id === "home" ? document.getElementById("hero") : document.getElementById(id);
      if (el) {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  // Smooth scroll handler
  const handleNavClick = (sectionId) => {
    if (location.pathname !== "/") {
      navigate(`/#${sectionId}`);
    } else {
      const el = sectionId === "home" ? document.getElementById("hero") : document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: "home", label: "Home" },
    { id: "mission", label: "Mission" },
    { id: "applications", label: "Applications" },
    { id: "research", label: "Research" },
    { id: "resources", label: "Resources" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <>
      <header
        className={`glass-header sticky-top d-flex align-items-center ${
          scrolled ? "navbar-scrolled" : ""
        }`}
        style={{
          height: scrolled ? "72px" : "80px",
          position: "sticky",
          top: 0,
          zIndex: 1000,
          width: "100%",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div
          className="container d-flex align-items-center justify-content-between"
          style={{ width: "100%" }}
        >
          {/* Logo Alignment Left */}
          <div onClick={() => handleNavClick("home")} style={{ cursor: "pointer" }} className="d-flex align-items-center">
            <img
              src={logo}
              alt="SATYA-EO Logo"
              style={{
                height: scrolled ? "42px" : "46px",
                width: "auto",
                objectFit: "contain",
                transition: "all 0.3s ease-in-out"
              }}
            />
          </div>

          {/* Desktop Navigation links centered */}
          <nav className="d-none d-lg-flex align-items-center gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`nav-link-custom border-0 bg-transparent ${activeSection === item.id ? "active" : ""}`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Direct Dashboard Link */}
            <Link
              to="/dashboard"
              className={`nav-link-custom ${location.pathname === "/dashboard" ? "active" : ""}`}
            >
              Dashboard
            </Link>
          </nav>

          {/* Desktop Controls Alignment Right */}
          <div className="d-none d-lg-flex align-items-center gap-3">
            {/* Search Bar */}
            <form onSubmit={handleSearchSubmit} className="position-relative">
              <input
                type="text"
                placeholder="Search datasets..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="navbar-search-input"
              />
              <Search
                size={14}
                className="position-absolute text-muted"
                style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }}
              />
            </form>

            {/* Notifications icon */}
            <button
              className="navbar-icon-btn position-relative"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="navbar-badge" />
            </button>

            {/* Theme Toggle */}
            <button
              className="navbar-icon-btn"
              onClick={() => setDarkTheme(!darkTheme)}
              title="Theme Toggle"
            >
              {darkTheme ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Settings */}
            <button
              className="navbar-icon-btn"
              title="Settings"
              onClick={() => navigate("/dashboard")}
            >
              <Settings size={18} />
            </button>

            {/* User Profile / CTA */}
            {userInfo ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="div"
                  style={{ cursor: "pointer" }}
                  className="d-flex align-items-center"
                >
                  <div className="navbar-user-avatar">
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
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login"
                  className="btn-signin-premium"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-cta-premium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <div className="d-flex d-lg-none align-items-center gap-3">
            {!userInfo && (
              <Link to="/signup" className="btn-cta-premium py-1.5 px-3" style={{ fontSize: "12px" }}>
                Register
              </Link>
            )}

            {userInfo && (
              <div className="navbar-user-avatar" onClick={() => navigate("/dashboard")}>
                {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="navbar-toggle-btn"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Slide-in Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="mobile-overlay-menu"
          >
            <div className="container py-4 d-flex flex-column h-100 justify-content-between">
              <div className="d-flex flex-column gap-3">
                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="position-relative w-100">
                  <input
                    type="text"
                    placeholder="Search datasets..."
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    className="navbar-search-input w-100"
                    style={{ width: "100%" }}
                  />
                  <Search
                    size={14}
                    className="position-absolute text-muted"
                    style={{ left: "14px", top: "50%", transform: "translateY(-50%)" }}
                  />
                </form>

                <nav className="d-flex flex-column gap-2 mt-2">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className={`mobile-nav-link text-left border-0 bg-transparent w-100 ${activeSection === item.id ? "text-primary" : ""}`}
                    >
                      {item.label}
                    </button>
                  ))}
                  
                  <Link
                    to="/dashboard"
                    className="mobile-nav-link"
                  >
                    Dashboard
                  </Link>
                </nav>
              </div>

              <div className="d-flex flex-column gap-3 border-top pt-4">
                {userInfo ? (
                  <>
                    <div className="d-flex align-items-center gap-3 px-2 mb-2">
                      <div className="navbar-user-avatar">
                        {userInfo.name ? userInfo.name.charAt(0).toUpperCase() : "U"}
                      </div>
                      <div>
                        <div style={{ fontWeight: "600", fontSize: "15px", color: "var(--color-primary)" }}>
                          {userInfo.name}
                        </div>
                        <div style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                          {userInfo.email}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={logoutHandler}
                      variant="outline-danger"
                      className="w-100 py-2"
                      style={{ borderRadius: "10px", fontSize: "14px" }}
                    >
                      <LogOut size={16} className="me-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <div className="d-flex gap-3">
                    <Link
                      to="/login"
                      className="btn-signin-premium text-center flex-grow-1"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-cta-premium text-center flex-grow-1"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Header;