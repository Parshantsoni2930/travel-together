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
              return {
                ...user,
                lastMessage: "No messages yet",
              };
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

    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/") ? img : `/${img}`
    }`;
  };

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>Connect • Chat • Travel</span>

          <h1 style={heroTitle}>Travel Chats</h1>

          <p style={heroText}>
            Talk with accepted travel buddies and plan your next journey
            together.
          </p>
        </div>

        <div style={statsGlass}>
          <span style={statsLabel}>Active Chats</span>

          <h2 style={statsValue}>{chatUsers.length}</h2>
        </div>
      </div>

      <div style={containerStyle}>
        {chatUsers.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>No chats available 😅</h3>

            <p style={emptyText}>
              Accepted trip buddies will appear here.
            </p>

            <button
              onClick={() => navigate("/home")}
              style={exploreBtn}
            >
              Explore Trips
            </button>
          </div>
        ) : (
          <div style={chatList}>
            {chatUsers.map((user) => {
              const imgUrl = getImageUrl(user.profileImage);

              const initial = user.name
                ? user.name.charAt(0).toUpperCase()
                : "U";

              return (
                <div
                  key={user._id}
                  onClick={() => navigate(`/chat/${user._id}`)}
                  style={chatCard}
                >
                  <div style={avatar}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={user.name}
                        style={avatarImg}
                      />
                    ) : (
                      <span style={avatarText}>
                        {initial}
                      </span>
                    )}
                  </div>

                  <div style={chatInfo}>
                    <div style={chatTop}>
                      <h3 style={userName}>
                        {user.name || "Unknown User"}
                      </h3>

                      <span style={statusDot}>
                        ● Online
                      </span>
                    </div>

                    <p style={lastMsg}>
                      {user.lastMessage || "No messages yet"}
                    </p>
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
  minHeight: "260px",
  margin: "0 auto 16px",
  padding: "28px",
  borderRadius: "30px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "18px",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.84), rgba(0,0,0,0.58), rgba(0,0,0,0.22))",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  maxWidth: "720px",
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
  fontSize: "clamp(38px, 6vw, 70px)",
  fontWeight: "900",
  lineHeight: "1",
  color: "#ffffff",
};

const heroText = {
  marginTop: "12px",
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "15px",
  maxWidth: "620px",
};

const statsGlass = {
  position: "relative",
  zIndex: 2,
  padding: "18px 24px",
  borderRadius: "24px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(12px)",
  color: "#ffffff",
  minWidth: "180px",
};

const statsLabel = {
  display: "block",
  fontSize: "13px",
  color: "#d4d4d4",
  marginBottom: "6px",
  fontWeight: "800",
};

const statsValue = {
  margin: 0,
  fontSize: "38px",
  fontWeight: "900",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "28px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  boxSizing: "border-box",
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
  padding: "18px",
  borderRadius: "22px",
  background: "#181818",
  border: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
};

const avatar = {
  width: "70px",
  height: "70px",
  borderRadius: "50%",
  background: "#ffffff",
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
  color: "#000000",
  fontSize: "28px",
  fontWeight: "900",
};

const chatInfo = {
  flex: 1,
  minWidth: 0,
};

const chatTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
};

const userName = {
  margin: 0,
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "900",
};

const statusDot = {
  color: "#22c55e",
  fontSize: "12px",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const lastMsg = {
  margin: "7px 0 0",
  color: "#9ca3af",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100%",
  fontSize: "14px",
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

const emptyBox = {
  padding: "42px",
  borderRadius: "24px",
  background: "#181818",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.06)",
};

const emptyTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
};

const emptyText = {
  color: "#9ca3af",
  marginTop: "10px",
  marginBottom: "18px",
};

const exploreBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

export default Chats;