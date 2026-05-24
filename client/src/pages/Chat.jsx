import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

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
  const [chatUser, setChatUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const bottomRef = useRef(null);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentUserId =
    currentUser?._id;

  const getImageUrl = (img) => {
    if (!img) return null;

    if (img.startsWith("http"))
      return img;

    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/")
        ? img
        : `/${img}`
    }`;
  };

  const fetchChatUser = async () => {
    try {
      const res = await api.get(
        `/users/${userId}`
      );

      setChatUser(res.data.user);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching user"
      );
    }
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);

      const data = await getMessages(
        userId
      );

      setMessages(data.messages || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error fetching messages"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      socket.emit(
        "join",
        currentUserId
      );
    }
  }, [currentUserId]);

  useEffect(() => {
    if (userId) {
      fetchChatUser();
      fetchMessages();
    }
  }, [userId]);

  useEffect(() => {
    const handleReceiveMessage = (
      newMessage
    ) => {
      if (
        newMessage.senderId === userId ||
        newMessage.receiverId === userId
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg.tempId ===
              newMessage.tempId
          );

          if (exists) return prev;

          return [
            ...prev,
            {
              _id:
                Date.now().toString(),
              sender:
                newMessage.senderId,
              receiver:
                newMessage.receiverId,
              text: newMessage.text,
              tempId:
                newMessage.tempId,
            },
          ];
        });
      }
    };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {
      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );
    };
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
      setSending(true);

      const tempId =
        Date.now().toString();

      const newMsg = {
        _id: tempId,
        sender: currentUserId,
        receiver: userId,
        text,
        tempId,
      };

      setMessages((prev) => [
        ...prev,
        newMsg,
      ]);

      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: userId,
        text,
        tempId,
      });

      await sendMessage({
        receiverId: userId,
        text,
      });

      setText("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error sending message"
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this message?"
      );

    if (!confirmDelete) return;

    try {
      await deleteMessage(id);

      setMessages((prev) =>
        prev.filter(
          (msg) => msg._id !== id
        )
      );

      toast.success(
        "Message deleted"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error deleting message"
      );
    }
  };

  const userName =
    chatUser?.name || "Loading...";

  const userImage = getImageUrl(
    chatUser?.profileImage
  );

  const userInitial = userName
    .charAt(0)
    .toUpperCase();

  return (
    <div style={pageStyle}>
      <div style={chatContainer}>
        <div style={chatHeader}>
          <button
            onClick={() =>
              navigate("/chats")
            }
            style={backBtn}
          >
            ←
          </button>

          <div
            style={avatarBox}
            onClick={() => {
              if (userId) {
                navigate(
                  `/user/${userId}`
                );
              }
            }}
          >
            {userImage ? (
              <img
                src={userImage}
                alt={userName}
                style={avatarImg}
              />
            ) : (
              <span
                style={avatarText}
              >
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
            onClick={() => {
              if (userId) {
                navigate(
                  `/user/${userId}`
                );
              }
            }}
            style={profileBtn}
          >
            Profile
          </button>
        </div>

        <div style={messagesBox}>
          {loading ? (
            <div style={emptyBox}>
              <h3 style={emptyTitle}>
                Loading chat...
              </h3>
            </div>
          ) : messages.length ===
            0 ? (
            <div style={emptyBox}>
              <h3 style={emptyTitle}>
                No messages yet 💬
              </h3>

              <p style={emptyText}>
                Start the
                conversation.
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId =
                typeof msg.sender ===
                "object"
                  ? msg.sender?._id
                  : msg.sender;

              const isMe =
                senderId ===
                currentUserId;

              return (
                <div
                  key={msg._id}
                  style={{
                    display: "flex",
                    justifyContent:
                      isMe
                        ? "flex-end"
                        : "flex-start",
                    marginBottom:
                      "12px",
                  }}
                >
                  <div
                    style={{
                      ...bubbleStyle,
                      background:
                        isMe
                          ? "#ffffff"
                          : "#181818",
                      color: isMe
                        ? "#000000"
                        : "#ffffff",
                      borderBottomRightRadius:
                        isMe
                          ? "4px"
                          : "18px",
                      borderBottomLeftRadius:
                        isMe
                          ? "18px"
                          : "4px",
                    }}
                  >
                    <span>
                      {msg.text}
                    </span>

                    {isMe &&
                      msg._id &&
                      msg._id.length >
                        10 && (
                        <button
                          onClick={() =>
                            handleDelete(
                              msg._id
                            )
                          }
                          style={
                            deleteBtn
                          }
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
              setText(
                e.target.value
              )
            }
            style={inputStyle}
          />

          <button
            type="submit"
            style={sendBtn}
            disabled={sending}
          >
            {sending
              ? "Sending..."
              : "Send"}
          </button>
        </form>
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

const heroSection = {
  position: "relative",
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto 18px",
  minHeight: "260px",
  borderRadius: "30px",
  overflow: "hidden",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border:
    "1px solid rgba(255,255,255,0.08)",
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
  padding: "34px",
  maxWidth: "700px",
};

const heroBadge = {
  display: "inline-block",
  padding: "8px 13px",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,0.12)",
  border:
    "1px solid rgba(255,255,255,0.18)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "14px",
};

const heroTitle = {
  margin: 0,
  fontSize:
    "clamp(38px, 6vw, 72px)",
  fontWeight: "900",
  lineHeight: "1",
  color: "#ffffff",
};

const heroText = {
  marginTop: "14px",
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "15px",
};

const statsGlass = {
  position: "absolute",
  right: "24px",
  bottom: "24px",
  zIndex: 2,
  padding: "18px 22px",
  borderRadius: "24px",
  background:
    "rgba(255,255,255,0.08)",
  backdropFilter: "blur(12px)",
  border:
    "1px solid rgba(255,255,255,0.12)",
  color: "#ffffff",
};

const statsLabel = {
  fontSize: "12px",
  color: "#d4d4d4",
};

const statsValue = {
  margin: "8px 0 0",
  fontSize: "36px",
  fontWeight: "900",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
};

const emptyBox = {
  width: "100%",
  minHeight: "340px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  borderRadius: "28px",
  background: "#111111",
  border:
    "1px solid rgba(255,255,255,0.08)",
};

const emptyTitle = {
  color: "#ffffff",
  marginBottom: "10px",
};

const emptyText = {
  color: "#9ca3af",
  marginBottom: "18px",
};

const exploreBtn = {
  padding: "14px 22px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const chatList = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};

const chatCard = {
  display: "flex",
  alignItems: "center",
  gap: "18px",
  padding: "18px",
  borderRadius: "24px",
  background: "#111111",
  border:
    "1px solid rgba(255,255,255,0.08)",
  cursor: "pointer",
};

const avatar = {
  width: "72px",
  height: "72px",
  borderRadius: "50%",
  overflow: "hidden",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
};

const avatarImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const avatarText = {
  fontSize: "28px",
  fontWeight: "900",
  color: "#000000",
};

const chatInfo = {
  flex: 1,
};

const chatTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const userName = {
  margin: 0,
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "900",
};

const statusDot = {
  color: "#22c55e",
  fontSize: "13px",
  fontWeight: "700",
};

const lastMsg = {
  marginTop: "8px",
  color: "#9ca3af",
  lineHeight: "1.6",
};

const profileBtn = {
  padding: "12px 18px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

export default Chat;