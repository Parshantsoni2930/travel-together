import {
  useEffect,
  useRef,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

import api from "../services/api";

import toast from "react-hot-toast";

const AIPlanner = () => {
  const location = useLocation();

  const selectedPlace =
    location.state?.placeName;

  const bottomRef = useRef(null);

  const typingIntervalRef =
    useRef(null);

  const [message, setMessage] =
    useState(
      selectedPlace
        ? `Plan a trip to ${selectedPlace}`
        : ""
    );

  const [messages, setMessages] =
    useState([
      {
        role: "ai",
        text: "Hey traveler 👋 Where are you planning to go?",
      },
    ]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (selectedPlace) {
      setMessages([
        {
          role: "ai",
          text: `Great choice 🔥 ${selectedPlace} is an amazing destination. Click Send and I'll create your trip plan.`,
        },
      ]);

      setMessage(
        `Plan a trip to ${selectedPlace}`
      );
    }
  }, [selectedPlace]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView(
      {
        behavior: "smooth",
      }
    );
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (
        typingIntervalRef.current
      ) {
        clearInterval(
          typingIntervalRef.current
        );
      }
    };
  }, []);

  const typeText = (text) => {
    let i = 0;

    setMessages((prev) => [
      ...prev,
      {
        role: "ai",
        text: "",
      },
    ]);

    typingIntervalRef.current =
      setInterval(() => {
        const char =
          text[i] || "";

        setMessages((prev) => {
          const updated = [
            ...prev,
          ];

          const lastIndex =
            updated.length - 1;

          updated[lastIndex] = {
            ...updated[
              lastIndex
            ],
            text:
              updated[lastIndex]
                .text + char,
          };

          return updated;
        });

        i++;

        if (i >= text.length) {
          clearInterval(
            typingIntervalRef.current
          );

          setLoading(false);
        }
      }, 10);
  };

  const handleSend =
    async () => {
      if (
        !message.trim() ||
        loading
      )
        return;

      const userMsg = {
        role: "user",
        text: message.trim(),
      };

      const updatedMessages = [
        ...messages,
        userMsg,
      ];

      setMessages(updatedMessages);

      setMessage("");

      setLoading(true);

      try {
        const res =
          await api.post(
            "/ai/suggest",
            {
              query:
                userMsg.text,
              history:
                updatedMessages,
            }
          );

        const aiReply =
          res.data.reply ||
          "Sorry, I couldn't understand your request.";

        typeText(aiReply);
      } catch (error) {
        console.log(
          "AI ERROR:",
          error
        );

        toast.error(
          "AI response failed. Try again."
        );

        setLoading(false);
      }
    };

  return (
    <div style={pageStyle}>
      <div
        style={
          plannerContainer
        }
      >
        <div style={heroSection}>
          <div
            style={
              heroOverlay
            }
          ></div>

          <div
            style={
              heroContent
            }
          >
            <span
              style={
                heroBadge
              }
            >
              AI • Smart Planning •
              Travel
            </span>

            <h1
              style={
                heroTitle
              }
            >
              AI Trip Planner
            </h1>

            <p style={heroText}>
              Ask for itineraries,
              budget planning,
              places to visit,
              transport, hotels,
              routes, and hidden
              gems.
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
              onClick={() =>
                setMessage(item)
              }
            >
              {item}
            </button>
          ))}
        </div>

        <div style={messagesBox}>
          {messages.map(
            (msg, index) => (
              <div
                key={index}
                style={{
                  display:
                    "flex",

                  justifyContent:
                    msg.role ===
                    "user"
                      ? "flex-end"
                      : "flex-start",

                  marginBottom:
                    "14px",
                }}
              >
                <div
                  style={{
                    ...bubbleStyle,

                    background:
                      msg.role ===
                      "user"
                        ? "#ffffff"
                        : "#181818",

                    color:
                      msg.role ===
                      "user"
                        ? "#000000"
                        : "#ffffff",

                    borderBottomRightRadius:
                      msg.role ===
                      "user"
                        ? "4px"
                        : "18px",

                    borderBottomLeftRadius:
                      msg.role ===
                      "user"
                        ? "18px"
                        : "4px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            )
          )}

          {loading && (
            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "flex-start",
              }}
            >
              <div
                style={
                  typingBubble
                }
              >
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
              setMessage(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (
                e.key ===
                "Enter"
              ) {
                handleSend();
              }
            }}
            style={inputStyle}
          />

          <button
            onClick={handleSend}
            disabled={loading}
            style={sendBtn}
          >
            {loading
              ? "..."
              : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* KEEP YOUR EXISTING STYLES SAME */

export default AIPlanner;