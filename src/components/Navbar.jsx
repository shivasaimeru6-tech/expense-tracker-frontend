import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Logo from "./Logo";
import { getInitials } from "../utils/helpers";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const loadUser = () => {
    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    loadUser();
    window.addEventListener("profile-updated", loadUser);
    return () => window.removeEventListener("profile-updated", loadUser);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#9a7b3c" : undefined,
    borderBottom:
      location.pathname === path ? "2px solid #9a7b3c" : "2px solid transparent",
    paddingBottom: "4px",
  });

  return (
    <nav className="navbar">
      <Link to="/dashboard" style={{ marginRight: "auto", textDecoration: "none" }}>
        <Logo size={34} />
      </Link>

      <Link to="/dashboard" style={linkStyle("/dashboard")}>Dashboard</Link>
      <Link to="/transactions" style={linkStyle("/transactions")}>Transactions</Link>
      <Link to="/budgets" style={linkStyle("/budgets")}>Budgets</Link>

      <div className="user-menu" ref={menuRef}>
        <button
          className="avatar-btn"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Open account menu"
        >
          {getInitials(user?.fullName)}
        </button>

        {menuOpen && (
          <div className="menu-dropdown">
            <div className="menu-head">
              <strong>{user?.fullName || "Your account"}</strong>
              <span>{user?.email}</span>
            </div>
            <Link className="menu-item" to="/profile" onClick={() => setMenuOpen(false)}>
              My Profile
            </Link>
            <Link className="menu-item" to="/settings" onClick={() => setMenuOpen(false)}>
              Settings
            </Link>
            <button className="menu-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;