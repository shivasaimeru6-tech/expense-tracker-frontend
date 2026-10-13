import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Settings() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [reportError, setReportError] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await api.put("/users/me/password", { currentPassword, newPassword });
      setMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReport = async () => {
    setReportError("");
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

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
      setReportError("Failed to download report");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <h2>Settings</h2>

        <div className="card">
          <h3>Security</h3>
          <form className="form-stack" onSubmit={handlePasswordChange}>
            <div>
              <label className="field-label">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="field-label">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <label className="field-label">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <div>
              <button type="submit" disabled={saving}>
                {saving ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </div>

        <div className="card">
          <h3>Your Data</h3>
          <p style={{ color: "#6b6f7a", fontSize: "14px", marginBottom: "16px" }}>
            Download a PDF statement of this month's income, expenses and
            category breakdown.
          </p>
          <button className="secondary" onClick={handleDownloadReport}>
            Download Monthly Report
          </button>
          {reportError && <p className="error-text">{reportError}</p>}
        </div>

        <div className="card">
          <h3>Session</h3>
          <p style={{ color: "#6b6f7a", fontSize: "14px", marginBottom: "16px" }}>
            Sign out of Aurum on this device.
          </p>
          <button className="danger" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;