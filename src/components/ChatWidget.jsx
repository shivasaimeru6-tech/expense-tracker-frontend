import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import Logo from "./Logo";

const SUGGESTIONS = [
  "How are my budgets doing?",
  "What did I spend the most on?",
  "Summarize this month for me",
];

function ChatWidget() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  const hiddenOn = ["/", "/login", "/register"];
  if (hiddenOn.includes(location.pathname) || !localStorage.getItem("token")) {
    return null;
  }

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const history = messages.slice(-10);
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: content, history });
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Sorry, I couldn't reach the assistant right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: msg }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-header">
            <Logo size={30} />
            <button className="chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-body">
            <div className="chat-bubble assistant">
              Good day. I'm your Aurum assistant. Ask me anything about your
              budgets, spending or savings.
            </div>

            {messages.length === 0 && (
              <div className="chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chat-chip" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.content}
              </div>
            ))}

            {loading && <div className="chat-bubble assistant">Thinking…</div>}
            <div ref={bottomRef} />
          </div>

          <form className="chat-input-row" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask about your budget…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={loading}>
              Send
            </button>
          </form>
        </div>
      )}

      <button
        className="chat-launcher"
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Aurum assistant"
      >
        <Logo size={46} showName={false} />
      </button>
    </>
  );
}

export default ChatWidget;