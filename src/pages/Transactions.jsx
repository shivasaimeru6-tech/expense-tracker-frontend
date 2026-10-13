import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [description, setDescription] = useState("");
  const [transactionDate, setTransactionDate] = useState("");

  const fetchTransactions = async () => {
    try {
      const response = await api.get("/transactions");
      setTransactions(response.data);
    } catch (err) {
      setError("Failed to load transactions");
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
    fetchTransactions();
    fetchCategories();
  }, []);

  const visibleCategories = categories.filter((c) => c.type === type);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategoryId("");
  };

  const resetForm = () => {
    setEditingId(null);
    setCategoryId("");
    setAmount("");
    setType("EXPENSE");
    setDescription("");
    setTransactionDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      categoryId: Number(categoryId),
      amount: Number(amount),
      type,
      description,
      transactionDate,
    };

    try {
      if (editingId) {
        await api.put(`/transactions/${editingId}`, payload);
      } else {
        await api.post("/transactions", payload);
      }
      resetForm();
      fetchTransactions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingId ? "Failed to update transaction" : "Failed to add transaction")
      );
    }
  };

  const handleEdit = (t) => {
    setEditingId(t.id);
    setType(t.type);
    setCategoryId("");
    setAmount(t.amount);
    setDescription(t.description || "");
    setTransactionDate(t.transactionDate);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      setError("Failed to delete transaction");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="page">
        <h2>Transactions</h2>

        <div className="card">
          <h3>{editingId ? "Edit Transaction" : "Add Transaction"}</h3>
          <form onSubmit={handleSubmit}>
            <select value={type} onChange={(e) => handleTypeChange(e.target.value)}>
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {visibleCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              required
            />

            <button type="submit">
              {editingId ? "Update Transaction" : "Add Transaction"}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>
                <td>{t.transactionDate}</td>
                <td>{t.categoryName}</td>
                <td>
                  <span className={`badge ${t.type === "INCOME" ? "ok" : "over"}`}>
                    {t.type}
                  </span>
                </td>
                <td>{t.amount}</td>
                <td>{t.description}</td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button className="secondary" onClick={() => handleEdit(t)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => handleDelete(t.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;