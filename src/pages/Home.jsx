import { Link, Navigate } from "react-router-dom";
import Logo from "../components/Logo";

const FEATURES = [
  { icon: "↔", title: "Track every transaction", text: "Record income and expenses by category and date, then edit or remove entries any time." },
  { icon: "◎", title: "Smart monthly budgets", text: "Set a limit per category and watch spending fill the bar, with warnings as you approach it." },
  { icon: "◔", title: "Clear visual analytics", text: "See where your money goes with category charts and a six-month income versus expense view." },
  { icon: "⇩", title: "PDF statements", text: "Download a formatted monthly report with your totals and category breakdown." },
  { icon: "✦", title: "Ask the assistant", text: "Chat about your own budgets and spending and get answers based on your data." },
  { icon: "⛨", title: "Private by design", text: "Your records are tied to your account only, protected by token-based sign-in." },
];

function Home() {
  if (localStorage.getItem("token")) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div>
      <nav className="landing-nav">
        <Logo size={38} />
        <div className="landing-nav-actions">
          <Link className="btn-link outline" to="/login">Sign in</Link>
          <Link className="btn-link" to="/register">Get started</Link>
        </div>
      </nav>

      <section className="hero">
        <div>
          <div className="hero-eyebrow">Personal finance, refined</div>
          <h1>
            Smart money, <em>beautifully</em> kept.
          </h1>
          <p className="lead">
            Aurum brings your income, spending and budgets into one calm,
            elegant place, so you always know where you stand.
          </p>
          <div className="hero-actions">
            <Link className="btn-link" to="/register">Create free account</Link>
            <Link className="btn-link outline" to="/login">Sign in</Link>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-tag">Sample preview</div>
          <div className="hero-card-row">
            <span>Income</span>
            <strong style={{ color: "#3f7d5c" }}>5,000</strong>
          </div>
          <div className="hero-card-row">
            <span>Expenses</span>
            <strong style={{ color: "#b04a4a" }}>3,200</strong>
          </div>
          <div className="hero-card-row">
            <span>Net savings</span>
            <strong>1,800</strong>
          </div>
          <div style={{ marginTop: "22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
              <span>Groceries</span>
              <span style={{ color: "#6b6f7a" }}>640 / 800</span>
            </div>
            <div className="budget-bar-track">
              <div className="budget-bar-fill" style={{ width: "80%", background: "#b8832b" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Everything you need, nothing you don't</h2>
        <p className="section-sub">Simple tools that make good money habits easy.</p>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h4>{f.title}</h4>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Get started in three steps</h2>
        <p className="section-sub">Up and running in a couple of minutes.</p>
        <div className="steps">
          <div>
            <div className="step-num">01</div>
            <h4>Create your account</h4>
            <p className="step-text">Register with your name and email, then sign in.</p>
          </div>
          <div>
            <div className="step-num">02</div>
            <h4>Log your money</h4>
            <p className="step-text">Add income and expenses, and set budgets per category.</p>
          </div>
          <div>
            <div className="step-num">03</div>
            <h4>Understand it</h4>
            <p className="step-text">Review charts, ask the assistant, and download your report.</p>
          </div>
        </div>
      </section>

      <section className="cta-band">
        <h2>Take control of your money today</h2>
        <p>Join Aurum and keep every rupee, dollar or euro accounted for.</p>
        <Link className="btn-link" to="/register">Create free account</Link>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} Aurum. All rights reserved.
      </footer>
    </div>
  );
}

export default Home;