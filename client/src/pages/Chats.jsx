import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getReceivedRequests,
  getSentRequests,
} from "../services/requestService";
import { getMessages } from "../services/messageService";
import toast from "react-hot-toast";


const Chats = () => {
  const [chatUsers, setChatUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const receivedData = await getReceivedRequests();
        const sentData = await getSentRequests();

        const receivedAccepted = (receivedData.requests || [])
          .filter((req) => req.status === "accepted" && req.sender)
          .map((req) => ({
            _id: req.sender._id,
            name: req.sender.name,
            email: req.sender.email,
            profileImage: req.sender.profileImage,
          }));

        const sentAccepted = (sentData.requests || [])
          .filter((req) => req.status === "accepted" && req.receiver)
          .map((req) => ({
            _id: req.receiver._id,
            name: req.receiver.name,
            email: req.receiver.email,
            profileImage: req.receiver.profileImage,
          }));

        const combined = [...receivedAccepted, ...sentAccepted];

        const uniqueUsers = combined.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u._id === user._id)
        );

        const usersWithMessages = await Promise.all(
          uniqueUsers.map(async (user) => {
            try {
              const res = await getMessages(user._id);
              const msgs = res.messages || [];
              const last = msgs[msgs.length - 1];

              return {
                ...user,
                lastMessage: last ? last.text : "No messages yet",
              };
            } catch {
              return { ...user, lastMessage: "No messages yet" };
            }
          })
        );

        setChatUsers(usersWithMessages);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading chats");
      }
    };

    fetchChats();
  }, []);

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `https://travel-together-z3dr.onrender.com${img.startsWith("/") ? img : `/${img}`}`;
  };

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Chats 💬</h2>
          <p style={subtitleStyle}>
            Chat with accepted travel buddies and plan your journey together.
          </p>
        </div>

        {chatUsers.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={{ margin: 0 }}>No chats available 😅</h3>
            <p style={{ color: "#64748b" }}>
              Accepted trip buddies will appear here.
            </p>
            <button onClick={() => navigate("/home")} style={exploreBtn}>
              Explore Trips
            </button>
          </div>
        ) : (
          <div style={chatList}>
            {chatUsers.map((user) => {
              const imgUrl = getImageUrl(user.profileImage);
              const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

              return (
                <div
                  key={user._id}
                  onClick={() => navigate(`/chat/${user._id}`)}
                  style={chatCard}
                >
                  <div style={avatar}>
                    {imgUrl ? (
                      <img src={imgUrl} alt={user.name} style={avatarImg} />
                    ) : (
                      <span style={avatarText}>{initial}</span>
                    )}
                  </div>

                  <div style={chatInfo}>
                    <div style={chatTop}>
                      <h3 style={userName}>{user.name || "Unknown User"}</h3>
                      <span style={statusDot}>● Online</span>
                    </div>

                    <p style={lastMsg}>{user.lastMessage || "No messages yet"}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/user/${user._id}`);
                    }}
                    style={profileBtn}
                  >
                    Profile
                  </button>
                </div>
              );
            })}
          </div>
        )}
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

const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "22px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const headerStyle = {
  marginBottom: "20px",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "900",
  color: "#111827",
};

const subtitleStyle = {
  margin: "8px 0 0",
  color: "#64748b",
};

const chatList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const chatCard = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  padding: "15px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  boxShadow: "0 8px 20px rgba(15,23,42,0.14)",
  cursor: "pointer",
  border: "1px solid #e2e8f0",
};

const avatar = {
  width: "54px",
  height: "54px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  flexShrink: 0,
};

const avatarImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const avatarText = {
  color: "#fff",
  fontSize: "22px",
  fontWeight: "900",
};

const chatInfo = {
  flex: 1,
};

const chatTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const userName = {
  margin: 0,
  color: "#111827",
};

const statusDot = {
  color: "#10b981",
  fontSize: "12px",
  fontWeight: "800",
};

const lastMsg = {
  margin: "6px 0 0",
  color: "#64748b",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "520px",
};

const profileBtn = {
  padding: "9px 13px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
};

const emptyBox = {
  padding: "35px",
  borderRadius: "18px",
  background: "#ffffff",
  textAlign: "center",
  boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
};

const exploreBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

export default Chats;