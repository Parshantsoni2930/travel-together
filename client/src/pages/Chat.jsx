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

    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/") ? img : `/${img}`
    }`;
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
    if (currentUserId) {
      socket.emit("join", currentUserId);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (userId) {
      fetchChatUser();
      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      if (
        newMessage.senderId === userId ||
        newMessage.receiverId === userId
      ) {
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
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
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
          <button
            onClick={() => navigate("/chats")}
            style={backBtn}
          >
            ←
          </button>

          <div
            style={avatarBox}
            onClick={() => navigate(`/user/${userId}`)}
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                style={avatarImg}
              />
            ) : (
              <span style={avatarText}>
                {userInitial}
              </span>
            )}
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={headerName}>
              {userName}
            </h3>

            <p style={onlineText}>
              ● Online
            </p>
          </div>

          <button
            onClick={() => navigate(`/user/${userId}`)}
            style={profileBtn}
          >
            Profile
          </button>
        </div>

        <div style={messagesBox}>
          {messages.length === 0 ? (
            <div style={emptyBox}>
              <h3 style={emptyTitle}>
                No messages yet 💬
              </h3>

              <p style={emptyText}>
                Start the conversation.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId =
                typeof msg.sender === "object"
                  ? msg.sender?._id
                  : msg.sender;

              const isMe = senderId === currentUserId;

              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    justifyContent: isMe
                      ? "flex-end"
                      : "flex-start",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      ...bubbleStyle,
                      background: isMe
                        ? "#ffffff"
                        : "#181818",
                      color: isMe
                        ? "#000000"
                        : "#ffffff",
                      borderBottomRightRadius: isMe
                        ? "4px"
                        : "18px",
                      borderBottomLeftRadius: isMe
                        ? "18px"
                        : "4px",
                    }}
                  >
                    <span>{msg.text}</span>

                    {isMe &&
                      msg._id &&
                      msg._id.length > 10 && (
                        <button
                          onClick={() =>
                            handleDelete(msg._id)
                          }
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

        <form
          onSubmit={handleSend}
          style={inputBar}
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) =>
              setText(e.target.value)
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={sendBtn}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const pageStyle = {
  width: "100%",
  height: "100vh",
  padding: "20px",
  background:
    "radial-gradient(circle at 15% 10%, rgba(124,58,237,0.14), transparent 28%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.10), transparent 25%), #050505",
  boxSizing: "border-box",
};

const chatContainer = {
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

const chatHeader = {
  height: "82px",
  padding: "0 22px",
  display: "flex",
  alignItems: "center",
  gap: "14px",
  background: "#0b0b0b",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
};

const backBtn = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#181818",
  color: "#ffffff",
  fontSize: "22px",
  cursor: "pointer",
  fontWeight: "900",
};

const avatarBox = {
  width: "56px",
  height: "56px",
  borderRadius: "50%",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  cursor: "pointer",
  flexShrink: 0,
};

const avatarImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const avatarText = {
  color: "#000000",
  fontWeight: "900",
  fontSize: "24px",
};

const headerName = {
  margin: 0,
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "900",
};

const onlineText = {
  margin: "4px 0 0",
  color: "#22c55e",
  fontSize: "12px",
  fontWeight: "900",
};

const profileBtn = {
  padding: "11px 16px",
  borderRadius: "14px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const messagesBox = {
  flex: 1,
  padding: "22px",
  overflowY: "auto",
  background:
    "radial-gradient(circle at top left, rgba(255,255,255,0.03), transparent 35%), #050505",
};

const bubbleStyle = {
  maxWidth: "65%",
  padding: "13px 16px",
  borderRadius: "18px",
  lineHeight: "1.5",
  wordBreak: "break-word",
  border: "1px solid rgba(255,255,255,0.06)",
};

const deleteBtn = {
  marginLeft: "10px",
  padding: "4px 8px",
  borderRadius: "999px",
  border: "none",
  background: "rgba(0,0,0,0.08)",
  color: "inherit",
  cursor: "pointer",
  fontSize: "10px",
  fontWeight: "900",
};

const inputBar = {
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
  padding: "14px 22px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const emptyBox = {
  textAlign: "center",
  color: "#ffffff",
  padding: "100px 20px",
};

const emptyTitle = {
  margin: 0,
  fontSize: "24px",
  fontWeight: "900",
};

const emptyText = {
  marginTop: "10px",
  color: "#9ca3af",
};

export default Chat;