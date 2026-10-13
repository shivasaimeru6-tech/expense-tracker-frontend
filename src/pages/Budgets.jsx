import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [categoryId, setCategoryId] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [monthYear, setMonthYear] = useState("");

  const fetchBudgets = async () => {
    try {
      const response = await api.get("/budgets");
      setBudgets(response.data);
    } catch (err) {
      setError("Failed to load budgets");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");
      setCategories(response.data);
    } catch (err) {
      setError("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchBudgets();
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/budgets", {
        categoryId: Number(categoryId),
        monthlyLimit: Number(monthlyLimit),
        monthYear,
      });

      setCategoryId("");
      setMonthlyLimit("");
      setMonthYear("");

      fetchBudgets();
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      setError(backendMessage || "Failed to add budget");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this budget?")) return;
    try {
      await api.delete(`/budgets/${id}`);
      fetchBudgets();
    } catch (err) {
      setError("Failed to delete budget");
    }
  };

  const getStatus = (spent, limit) => {
    const pct = limit > 0 ? (spent / limit) * 100 : 0;
    if (pct >= 100) return { label: "Over Budget", cls: "over", color: "#b04a4a" };
    if (pct >= 80) return { label: "Near Limit", cls: "warn", color: "#b8832b" };
    return { label: "On Track", cls: "ok", color: "#3f7d5c" };
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <h2>Budgets</h2>

        <div className="card">
          <h3>Add Budget</h3>
          <form onSubmit={handleSubmit}>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.filter((c) => c.type === "EXPENSE").map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Monthly Limit"
              value={monthlyLimit}
              onChange={(e) => setMonthlyLimit(e.target.value)}
              required
            />

            <input
              type="month"
              value={monthYear}
              onChange={(e) => setMonthYear(e.target.value)}
              required
            />

            <button type="submit">Add Budget</button>
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>

        <div style={{ display: "grid", gap: "16px" }}>
          {budgets.map((b) => {
            const status = getStatus(b.spentSoFar, b.monthlyLimit);
            const pct = Math.min((b.spentSoFar / b.monthlyLimit) * 100, 100);

            return (
              <div className="card" key={b.id} style={{ marginBottom: 0 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ fontSize: "16px" }}>{b.categoryName}</strong>
                    <span style={{ color: "#6b6f7a", marginLeft: "10px", fontSize: "13px" }}>
                      {b.monthYear}
                    </span>
                  </div>
                  <span className={`badge ${status.cls}`}>{status.label}</span>
                </div>

                <div className="budget-bar-track">
                  <div
                    className="budget-bar-fill"
                    style={{ width: `${pct}%`, background: status.color }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                    fontSize: "13px",
                    color: "#6b6f7a",
                  }}
                >
                  <span>Spent: {b.spentSoFar} / {b.monthlyLimit}</span>
                  <span>Remaining: {b.remaining}</span>
                </div>

                <button
                  className="danger"
                  style={{ marginTop: "12px" }}
                  onClick={() => handleDelete(b.id)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Budgets;