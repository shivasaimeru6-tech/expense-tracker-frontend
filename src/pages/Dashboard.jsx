import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [trend, setTrend] = useState([]);
  const [error, setError] = useState("");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const currentMonthKey = `${year}-${String(month).padStart(2, "0")}`;

  useEffect(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(year, month - 1 - i, 1);
      months.push({
        m: d.getMonth() + 1,
        y: d.getFullYear(),
        label: d.toLocaleString("en-US", { month: "short" }),
      });
    }

    const load = async () => {
      const [p, s, b, t, bu, ...trendRes] = await Promise.allSettled([
        api.get("/users/me"),
        api.get(`/analytics/summary?month=${month}&year=${year}`),
        api.get(`/analytics/category-breakdown?month=${month}&year=${year}`),
        api.get("/transactions"),
        api.get("/budgets"),
        ...months.map((x) => api.get(`/analytics/summary?month=${x.m}&year=${x.y}`)),
      ]);

      if (p.status === "fulfilled") setProfile(p.value.data);
      if (s.status === "fulfilled") setSummary(s.value.data);
      else setError("Failed to load dashboard data");
      if (b.status === "fulfilled") setBreakdown(b.value.data);
      if (t.status === "fulfilled") setTransactions(t.value.data);
      if (bu.status === "fulfilled") setBudgets(bu.value.data);

      setTrend(
        months.map((x, i) => ({
          label: x.label,
          income:
            trendRes[i].status === "fulfilled"
              ? Number(trendRes[i].value.data.totalIncome)
              : 0,
          expense:
            trendRes[i].status === "fulfilled"
              ? Number(trendRes[i].value.data.totalExpense)
              : 0,
        }))
      );
    };

    load();
  }, []);

  const handleDownloadPdf = async () => {
    try {
      const response = await api.get(
        `/analytics/export/pdf?month=${month}&year=${year}`,
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `aurum-report-${year}-${month}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError("Failed to download PDF report");
    }
  };

  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = profile?.fullName ? profile.fullName.split(" ")[0] : "";

  const income = summary ? Number(summary.totalIncome) : 0;
  const net = summary ? Number(summary.netSavings) : 0;
  const savingsRate = income > 0 ? Math.round((net / income) * 100) : null;

  const expenseData = breakdown.filter((b) => b.type === "EXPENSE");

  const pieData = {
    labels: expenseData.map((b) => b.categoryName),
    datasets: [
      {
        data: expenseData.map((b) => b.totalAmount),
        backgroundColor: ["#9a7b3c", "#3f7d5c", "#b04a4a", "#5b7c99", "#c9a961", "#8c887e"],
        borderColor: "#ffffff",
        borderWidth: 3,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: { position: "bottom", labels: { color: "#1f2430", padding: 14 } },
    },
  };

  const barData = {
    labels: trend.map((x) => x.label),
    datasets: [
      { label: "Income", data: trend.map((x) => x.income), backgroundColor: "#3f7d5c", borderRadius: 3 },
      { label: "Expense", data: trend.map((x) => x.expense), backgroundColor: "#b04a4a", borderRadius: 3 },
    ],
  };

  const barOptions = {
    plugins: { legend: { position: "bottom", labels: { color: "#1f2430" } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: "#6b6f7a" } },
      y: { beginAtZero: true, ticks: { color: "#6b6f7a" }, grid: { color: "#efe9dc" } },
    },
  };

  const recent = [...transactions]
    .sort((a, b) =>
      b.transactionDate === a.transactionDate
        ? b.id - a.id
        : b.transactionDate.localeCompare(a.transactionDate)
    )
    .slice(0, 5);

  const monthBudgets = budgets.filter((b) => b.monthYear === currentMonthKey);

  const budgetColor = (spent, limit) => {
    const pct = limit > 0 ? (spent / limit) * 100 : 0;
    if (pct >= 100) return "#b04a4a";
    if (pct >= 80) return "#b8832b";
    return "#3f7d5c";
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <div className="greeting">
            <h2 style={{ marginBottom: "4px" }}>
              {greeting}{firstName && `, ${firstName}`}
            </h2>
            <p style={{ color: "#6b6f7a", fontSize: "14px" }}>
              Here is your financial overview for{" "}
              {now.toLocaleString("en-US", { month: "long", year: "numeric" })}.
            </p>
          </div>
          <button onClick={handleDownloadPdf}>Download PDF Report</button>
        </div>

        {error && <p className="error-text">{error}</p>}

        <div className="stat-grid">
          <div className="stat-card income">
            <div className="label">Total Income</div>
            <div className="value">{summary ? summary.totalIncome : "—"}</div>
          </div>
          <div className="stat-card expense">
            <div className="label">Total Expense</div>
            <div className="value">{summary ? summary.totalExpense : "—"}</div>
          </div>
          <div className="stat-card savings">
            <div className="label">Net Savings</div>
            <div className="value" style={{ color: net < 0 ? "#b04a4a" : undefined }}>
              {summary ? summary.netSavings : "—"}
            </div>
          </div>
          <div className="stat-card savings">
            <div className="label">Savings Rate</div>
            <div className="value">{savingsRate === null ? "—" : `${savingsRate}%`}</div>
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <h3>Expense Breakdown</h3>
            {expenseData.length > 0 ? (
              <div style={{ maxWidth: "300px", margin: "0 auto" }}>
                <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <p className="empty-note">No expenses recorded this month yet.</p>
            )}
          </div>

          <div className="card">
            <h3>Income vs Expense · 6 Months</h3>
            {trend.length > 0 ? (
              <Bar data={barData} options={barOptions} />
            ) : (
              <p className="empty-note">Loading...</p>
            )}
          </div>
        </div>

        <div className="two-col">
          <div className="card">
            <h3>Recent Transactions</h3>
            {recent.length === 0 ? (
              <p className="empty-note">No transactions yet.</p>
            ) : (
              recent.map((t) => (
                <div className="list-row" key={t.id}>
                  <div>
                    <strong>{t.categoryName}</strong>
                    <small>
                      {t.transactionDate}
                      {t.description ? ` · ${t.description}` : ""}
                    </small>
                  </div>
                  <span className={t.type === "INCOME" ? "amount-in" : "amount-out"}>
                    {t.type === "INCOME" ? "+" : "−"}
                    {t.amount}
                  </span>
                </div>
              ))
            )}
            <div style={{ marginTop: "16px" }}>
              <Link className="btn-link outline" to="/transactions">View all</Link>
            </div>
          </div>

          <div className="card">
            <h3>Budget Overview · This Month</h3>
            {monthBudgets.length === 0 ? (
              <p className="empty-note">No budgets set for this month.</p>
            ) : (
              monthBudgets.map((b) => {
                const pct = Math.min((b.spentSoFar / b.monthlyLimit) * 100, 100);
                return (
                  <div key={b.id} style={{ marginBottom: "18px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                      <strong>{b.categoryName}</strong>
                      <span style={{ color: "#6b6f7a" }}>
                        {b.spentSoFar} / {b.monthlyLimit}
                      </span>
                    </div>
                    <div className="budget-bar-track">
                      <div
                        className="budget-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: budgetColor(b.spentSoFar, b.monthlyLimit),
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
            <div style={{ marginTop: "8px" }}>
              <Link className="btn-link outline" to="/budgets">Manage budgets</Link>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <Link className="btn-link" to="/transactions">+ Add transaction</Link>
          <Link className="btn-link outline" to="/budgets">+ Set a budget</Link>
          <Link className="btn-link outline" to="/profile">My profile</Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;