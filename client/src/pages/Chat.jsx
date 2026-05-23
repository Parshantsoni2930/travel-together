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

/* KEEP YOUR EXISTING STYLES SAME */

export default Chat;