import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getMessages,
  sendMessage,
  deleteMessage,
} from "../services/messageService";
import api from "../services/api";
import socket from "../services/socket";
import toast from "react-hot-toast";


const Chat = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);

  const bottomRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `https://travel-together-z3dr.onrender.com${img.startsWith("/") ? img : `/${img}`}`;
  };

  const fetchChatUser = async () => {
    try {
      const res = await api.get(`/users/${userId}`);
      setChatUser(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching user");
    }
  };

  const fetchMessages = async () => {
    try {
      const data = await getMessages(userId);
      setMessages(data.messages || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching messages");
    }
  };

  useEffect(() => {
    if (currentUserId) socket.emit("join", currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (userId) {
      fetchChatUser();
      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (newMessage.senderId === userId || newMessage.receiverId === userId) {
        setMessages((prev) => [
          ...prev,
          {
            _id: Date.now().toString(),
            sender: newMessage.senderId,
            receiver: newMessage.receiverId,
            text: newMessage.text,
          },
        ]);
      }
    });

    return () => socket.off("receiveMessage");
  }, [userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await sendMessage({
        receiverId: userId,
        text,
      });

      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: userId,
        text,
      });

      setMessages((prev) => [
        ...prev,
        {
          _id: Date.now().toString(),
          sender: currentUserId,
          receiver: userId,
          text,
        },
      ]);

      setText("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending message");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this message?");
    if (!confirmDelete) return;

    try {
      await deleteMessage(id);
      fetchMessages();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting message");
    }
  };

  const userName = chatUser?.name || "Loading...";
  const userImage = getImageUrl(chatUser?.profileImage);
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div style={pageStyle}>
      <div style={chatContainer}>
        <div style={chatHeader}>
          <button onClick={() => navigate("/chats")} style={backBtn}>
            ←
          </button>

          <div
            style={avatarBox}
            onClick={() => navigate(`/user/${userId}`)}
          >
            {userImage ? (
              <img src={userImage} alt={userName} style={avatarImg} />
            ) : (
              <span style={avatarText}>{userInitial}</span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={headerName}>{userName}</h3>
            <p style={onlineText}>● Online</p>
          </div>

          <button onClick={() => navigate(`/user/${userId}`)} style={profileBtn}>
            Profile
          </button>
        </div>

        <div style={messagesBox}>
          {messages.length === 0 ? (
            <div style={emptyBox}>
              <h3 style={{ margin: 0 }}>No messages yet 💬</h3>
              <p style={{ margin: "8px 0 0", color: "#cbd5e1" }}>
                Start the conversation.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId =
                typeof msg.sender === "object" ? msg.sender?._id : msg.sender;

              const isMe = senderId === currentUserId;

              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      ...bubbleStyle,
                      background: isMe
                        ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                        : "linear-gradient(135deg, #ffffff, #eef2ff)",
                      color: isMe ? "#ffffff" : "#111827",
                      borderBottomRightRadius: isMe ? "4px" : "18px",
                      borderBottomLeftRadius: isMe ? "18px" : "4px",
                    }}
                  >
                    <span>{msg.text}</span>

                    {isMe && msg._id && msg._id.length > 10 && (
                      <button
                        onClick={() => handleDelete(msg._id)}
                        style={deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSend} style={inputBar}>
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={inputStyle}
          />

          <button type="submit" style={sendBtn}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  padding: "24px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const chatContainer = {
  maxWidth: "900px",
  height: "calc(100vh - 135px)",
  margin: "0 auto",
  borderRadius: "22px",
  overflow: "hidden",
  background: "linear-gradient(135deg, #0f172a, #111827)",
  boxShadow: "0 12px 35px rgba(0,0,0,0.45)",
  display: "flex",
  flexDirection: "column",
};

const chatHeader = {
  height: "74px",
  padding: "0 18px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  background:
    "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
};

const backBtn = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  border: "none",
  background: "rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: "22px",
  cursor: "pointer",
};

const avatarBox = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
  border: "2px solid rgba(255,255,255,0.8)",
};

const avatarImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const avatarText = {
  color: "#fff",
  fontWeight: "900",
  fontSize: "20px",
};

const headerName = {
  margin: 0,
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "900",
};

const onlineText = {
  margin: "3px 0 0",
  color: "#22c55e",
  fontSize: "12px",
  fontWeight: "800",
};

const profileBtn = {
  padding: "9px 14px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
};

const messagesBox = {
  flex: 1,
  padding: "18px",
  overflowY: "auto",
  background:
    "radial-gradient(circle at top left, rgba(79,70,229,0.22), transparent 35%), radial-gradient(circle at bottom right, rgba(236,72,153,0.18), transparent 30%), #020617",
};

const bubbleStyle = {
  maxWidth: "65%",
  padding: "11px 14px",
  borderRadius: "18px",
  boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
  lineHeight: "1.45",
  wordBreak: "break-word",
};

const deleteBtn = {
  marginLeft: "10px",
  padding: "4px 7px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(255,255,255,0.18)",
  color: "#fff",
  cursor: "pointer",
  fontSize: "10px",
  fontWeight: "800",
};

const inputBar = {
  padding: "14px",
  display: "flex",
  gap: "10px",
  background: "rgba(15,23,42,0.98)",
  borderTop: "1px solid rgba(255,255,255,0.12)",
};

const inputStyle = {
  flex: 1,
  padding: "13px 15px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.15)",
  outline: "none",
  background: "#f8fafc",
  color: "#111827",
};

const sendBtn = {
  padding: "13px 20px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const emptyBox = {
  textAlign: "center",
  color: "#fff",
  padding: "80px 20px",
};

export default Chat;