import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

const AIPlanner = () => {
  const location = useLocation();
  const selectedPlace = location.state?.placeName;

  const bottomRef = useRef(null);

  const [message, setMessage] = useState(
    selectedPlace ? `Plan a trip to ${selectedPlace}` : ""
  );

  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hey bro 👋 Where are you planning to travel?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlace) {
      setMessages([
        {
          role: "ai",
          text: `Nice choice 🔥 ${selectedPlace} is a great destination! Click Send and I'll plan it for you.`,
        },
      ]);

      setMessage(`Plan a trip to ${selectedPlace}`);
    }
  }, [selectedPlace]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const typeText = (text) => {
    let i = 0;

    setMessages((prev) => [...prev, { role: "ai", text: "" }]);

    const interval = setInterval(() => {
      const char = text[i] || "";

      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];

        updated[updated.length - 1] = {
          ...last,
          text: last.text + char,
        };

        return updated;
      });

      i++;

      if (i >= text.length) {
        clearInterval(interval);
        setLoading(false);
      }
    }, 12);
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = { role: "user", text: message };
    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/ai/suggest", {
        query: userMsg.text,
        history: updatedMessages,
      });

      typeText(res.data.reply || "Sorry bro, I couldn't understand.");
    } catch (error) {
      toast.error("AI response failed. Try again.");

      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={chatBox}>
        <div style={headerStyle}>
          <div style={botAvatar}>✨</div>

          <div>
            <h2 style={titleStyle}>AI Trip Assistant</h2>
            <p style={subtitleStyle}>
              Ask for itinerary, budget, routes, places, safety tips & more.
            </p>
          </div>
        </div>

        <div style={quickRow}>
          {["Plan Goa trip", "Budget Manali trip", "3-day Jaipur itinerary"].map(
            (item) => (
              <button
                key={item}
                style={quickBtn}
                onClick={() => setMessage(item)}
              >
                {item}
              </button>
            )
          )}
        </div>

        <div style={messagesBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "13px",
              }}
            >
              <div
                style={{
                  ...bubbleStyle,
                  background:
                    msg.role === "user"
                      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                      : "linear-gradient(135deg, #ffffff, #eef2ff)",
                  color: msg.role === "user" ? "#ffffff" : "#111827",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : "18px",
                  borderBottomLeftRadius: msg.role === "user" ? "18px" : "4px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div style={typingBubble}>AI typing...</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={inputRow}>
          <input
            type="text"
            placeholder="Ask AI to plan your trip..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            style={inputStyle}
          />

          <button onClick={handleSend} disabled={loading} style={sendBtn}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  padding: "24px",
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const chatBox = {
  maxWidth: "900px",
  height: "calc(100vh - 135px)",
  margin: "0 auto",
  borderRadius: "24px",
  overflow: "hidden",
  background: "linear-gradient(135deg, #0f172a, #111827)",
  boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
  display: "flex",
  flexDirection: "column",
};

const headerStyle = {
  padding: "18px 20px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const botAvatar = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
  boxShadow: "0 8px 20px rgba(236,72,153,0.35)",
};

const titleStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "900",
};

const subtitleStyle = {
  margin: "4px 0 0",
  color: "#cbd5e1",
  fontSize: "13px",
};

const quickRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  padding: "14px 18px",
  background: "rgba(15,23,42,0.85)",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const quickBtn = {
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.08)",
  color: "#e5e7eb",
  cursor: "pointer",
  fontWeight: "700",
};

const messagesBox = {
  flex: 1,
  overflowY: "auto",
  padding: "18px",
  background:
    "radial-gradient(circle at top left, rgba(79,70,229,0.22), transparent 35%), radial-gradient(circle at bottom right, rgba(236,72,153,0.18), transparent 30%), #020617",
};

const bubbleStyle = {
  maxWidth: "72%",
  padding: "12px 16px",
  borderRadius: "18px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
  lineHeight: "1.55",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
};

const typingBubble = {
  padding: "10px 14px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #ffffff, #eef2ff)",
  color: "#64748b",
  fontWeight: "700",
};

const inputRow = {
  padding: "14px",
  display: "flex",
  gap: "10px",
  background: "rgba(15,23,42,0.98)",
  borderTop: "1px solid rgba(255,255,255,0.12)",
};

const inputStyle = {
  flex: 1,
  padding: "14px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.15)",
  outline: "none",
  background: "#f8fafc",
  color: "#111827",
};

const sendBtn = {
  padding: "14px 24px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

export default AIPlanner;