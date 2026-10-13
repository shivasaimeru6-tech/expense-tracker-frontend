import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  const location = useLocation();
  const hiddenOn = ["/", "/login", "/register"];

  if (hiddenOn.includes(location.pathname)) return null;

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ maxWidth: "280px" }}>
          <Logo size={34} />
          <p style={{ color: "#6b6f7a", fontSize: "13px", marginTop: "12px", lineHeight: 1.6 }}>
            Smart money, beautifully kept. Track spending, set budgets and
            understand where your money goes.
          </p>
        </div>

        <div className="footer-links">
          <div>
            <h4>Explore</h4>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/transactions">Transactions</Link>
            <Link to="/budgets">Budgets</Link>
          </div>
          <div>
            <h4>Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/settings">Settings</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Aurum. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;