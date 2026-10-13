import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import Logo from "../components/Logo";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ marginBottom: "28px" }}>
          <Logo size={64} stacked />
        </div>
        <h2 style={{ fontSize: "22px", textAlign: "center", marginBottom: "20px" }}>
          Welcome back
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
        {error && <p className="error-text" style={{ textAlign: "center" }}>{error}</p>}
        <p>
          New to Aurum? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;