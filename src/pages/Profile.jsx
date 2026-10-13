import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { getInitials } from "../utils/helpers";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({
    transactions: 0,
    budgets: 0,
    income: 0,
    expense: 0,
    savings: 0,
  });
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  useEffect(() => {
    const load = async () => {
      const [p, t, b, s] = await Promise.allSettled([
        api.get("/users/me"),
        api.get("/transactions"),
        api.get("/budgets"),
        api.get(`/analytics/summary?month=${month}&year=${year}`),
      ]);

      if (p.status === "fulfilled") {
        setProfile(p.value.data);
        setFullName(p.value.data.fullName);
      } else {
        setError("Failed to load profile");
      }

      setStats({
        transactions: t.status === "fulfilled" ? t.value.data.length : 0,
        budgets: b.status === "fulfilled" ? b.value.data.length : 0,
        income: s.status === "fulfilled" ? s.value.data.totalIncome : 0,
        expense: s.status === "fulfilled" ? s.value.data.totalExpense : 0,
        savings: s.status === "fulfilled" ? s.value.data.netSavings : 0,
      });
    };

    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setSaving(true);

    try {
      const res = await api.put("/users/me", { fullName });
      setProfile(res.data);
      setMessage("Profile updated.");
      window.dispatchEvent(new Event("profile-updated"));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <div className="card">
          <div className="profile-header">
            <div className="profile-avatar">{getInitials(profile?.fullName)}</div>
            <div>
              <h2>{profile?.fullName || "Loading..."}</h2>
              <div className="profile-meta">{profile?.email}</div>
              <div style={{ marginTop: "10px" }}>
                <span className="badge ok">{profile?.role || "USER"}</span>
              </div>
            </div>
          </div>
        </div>

        <h3>This Month at a Glance</h3>
        <div className="stat-grid">
          <div className="stat-card income">
            <div className="label">Income</div>
            <div className="value">{stats.income}</div>
          </div>
          <div className="stat-card expense">
            <div className="label">Expenses</div>
            <div className="value">{stats.expense}</div>
          </div>
          <div className="stat-card savings">
            <div className="label">Net Savings</div>
            <div className="value">{stats.savings}</div>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat-card">
            <div className="label">Total Transactions</div>
            <div className="value">{stats.transactions}</div>
          </div>
          <div className="stat-card">
            <div className="label">Budgets Created</div>
            <div className="value">{stats.budgets}</div>
          </div>
        </div>

        <div className="card">
          <h3>Account Details</h3>
          <div className="info-row">
            <span>Full name</span>
            <span>{profile?.fullName}</span>
          </div>
          <div className="info-row">
            <span>Email</span>
            <span>{profile?.email}</span>
          </div>
          <div className="info-row">
            <span>Account type</span>
            <span>{profile?.role}</span>
          </div>
          <div className="info-row">
            <span>Account ID</span>
            <span>#{profile?.id}</span>
          </div>
        </div>

        <div className="card">
          <h3>Edit Profile</h3>
          <form className="form-stack" onSubmit={handleSave}>
            <div>
              <label className="field-label">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">Email (cannot be changed)</label>
              <input type="email" value={profile?.email || ""} disabled />
            </div>
            <div>
              <button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default Profile;