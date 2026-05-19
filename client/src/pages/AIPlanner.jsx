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
      text: "Hey traveler 👋 Where are you planning to go?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPlace) {
      setMessages([
        {
          role: "ai",
          text: `Great choice 🔥 ${selectedPlace} is an amazing destination. Click Send and I'll create your trip plan.`,
        },
      ]);

      setMessage(`Plan a trip to ${selectedPlace}`);
    }
  }, [selectedPlace]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const typeText = (text) => {
    let i = 0;

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "",
      },
    ]);

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
    }, 10);
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMsg = {
      role: "user",
      text: message,
    };

    const updatedMessages = [...messages, userMsg];

    setMessages(updatedMessages);
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/ai/suggest", {
        query: userMsg.text,
        history: updatedMessages,
      });

      typeText(
        res.data.reply ||
          "Sorry, I couldn't understand your request."
      );
    } catch (error) {
      toast.error("AI response failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={plannerContainer}>
        <div style={heroSection}>
          <div style={heroOverlay}></div>

          <div style={heroContent}>
            <span style={heroBadge}>
              AI • Smart Planning • Travel
            </span>

            <h1 style={heroTitle}>
              AI Trip Planner
            </h1>

            <p style={heroText}>
              Ask for itineraries, budget planning, places to visit,
              transport, hotels, routes, and hidden gems.
            </p>
          </div>
        </div>

        <div style={quickRow}>
          {[
            "Plan Goa trip",
            "Budget Manali trip",
            "3-day Jaipur itinerary",
            "Best places in Kashmir",
            "Cheap Thailand trip",
          ].map((item) => (
            <button
              key={item}
              style={quickBtn}
              onClick={() => setMessage(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div style={messagesBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  msg.role === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "14px",
              }}
            >
              <div
                style={{
                  ...bubbleStyle,
                  background:
                    msg.role === "user"
                      ? "#ffffff"
                      : "#181818",
                  color:
                    msg.role === "user"
                      ? "#000000"
                      : "#ffffff",
                  borderBottomRightRadius:
                    msg.role === "user"
                      ? "4px"
                      : "18px",
                  borderBottomLeftRadius:
                    msg.role === "user"
                      ? "18px"
                      : "4px",
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div style={typingBubble}>
                AI is thinking...
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={inputRow}>
          <input
            type="text"
            placeholder="Ask AI to plan your journey..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) =>
              e.key === "Enter" && handleSend()
            }
            style={inputStyle}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            style={sendBtn}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "20px",
  background:
    "radial-gradient(circle at 15% 10%, rgba(124,58,237,0.14), transparent 28%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.10), transparent 25%), #050505",
  boxSizing: "border-box",
};

const plannerContainer = {
  width: "100%",
  maxWidth: "1400px",
  height: "calc(100vh - 40px)",
  margin: "0 auto",
  borderRadius: "30px",
  overflow: "hidden",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
  display: "flex",
  flexDirection: "column",
};

const heroSection = {
  position: "relative",
  minHeight: "240px",
  padding: "28px",
  overflow: "hidden",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.84), rgba(0,0,0,0.55), rgba(0,0,0,0.25))",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  maxWidth: "760px",
};

const heroBadge = {
  display: "inline-block",
  padding: "8px 13px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "14px",
};

const heroTitle = {
  margin: 0,
  fontSize: "clamp(38px, 6vw, 74px)",
  fontWeight: "900",
  lineHeight: "1",
  color: "#ffffff",
};

const heroText = {
  marginTop: "14px",
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "15px",
  maxWidth: "680px",
};

const quickRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  padding: "14px 18px",
  background: "#0b0b0b",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const quickBtn = {
  padding: "9px 14px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#181818",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "800",
};

const messagesBox = {
  flex: 1,
  overflowY: "auto",
  padding: "22px",
  background:
    "radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 35%), #050505",
};

const bubbleStyle = {
  maxWidth: "72%",
  padding: "13px 16px",
  borderRadius: "18px",
  lineHeight: "1.6",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  border: "1px solid rgba(255,255,255,0.06)",
};

const typingBubble = {
  padding: "11px 15px",
  borderRadius: "18px",
  background: "#181818",
  color: "#d4d4d4",
  fontWeight: "800",
  border: "1px solid rgba(255,255,255,0.06)",
};

const inputRow = {
  padding: "16px",
  display: "flex",
  gap: "10px",
  background: "#0b0b0b",
  borderTop: "1px solid rgba(255,255,255,0.08)",
};

const inputStyle = {
  flex: 1,
  padding: "14px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  background: "#181818",
  color: "#ffffff",
  fontSize: "14px",
};

const sendBtn = {
  padding: "14px 24px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

export default AIPlanner;