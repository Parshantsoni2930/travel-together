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
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);

        const receivedData =
          await getReceivedRequests();

        const sentData =
          await getSentRequests();

        const receivedAccepted = (
          receivedData.requests || []
        )
          .filter(
            (req) =>
              req.status === "accepted" &&
              req.sender
          )
          .map((req) => ({
            _id: req.sender._id,
            name: req.sender.name,
            email: req.sender.email,
            profileImage:
              req.sender.profileImage,
          }));

        const sentAccepted = (
          sentData.requests || []
        )
          .filter(
            (req) =>
              req.status === "accepted" &&
              req.receiver
          )
          .map((req) => ({
            _id: req.receiver._id,
            name: req.receiver.name,
            email: req.receiver.email,
            profileImage:
              req.receiver.profileImage,
          }));

        const combined = [
          ...receivedAccepted,
          ...sentAccepted,
        ];

        const uniqueUsers = combined.filter(
          (user, index, self) =>
            index ===
            self.findIndex(
              (u) => u._id === user._id
            )
        );

        const usersWithMessages =
          await Promise.all(
            uniqueUsers.map(async (user) => {
              try {
                const res =
                  await getMessages(
                    user._id
                  );

                const msgs =
                  res.messages || [];

                const last =
                  msgs[msgs.length - 1];

                return {
                  ...user,
                  lastMessage: last
                    ? last.text
                    : "No messages yet",
                };
              } catch {
                return {
                  ...user,
                  lastMessage:
                    "No messages yet",
                };
              }
            })
          );

        setChatUsers(usersWithMessages);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Error loading chats"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

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

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>
            Connect • Chat • Travel
          </span>

          <h1 style={heroTitle}>
            Travel Chats
          </h1>

          <p style={heroText}>
            Talk with accepted travel
            buddies and plan your next
            journey together.
          </p>
        </div>

        <div style={statsGlass}>
          <span style={statsLabel}>
            Active Chats
          </span>

          <h2 style={statsValue}>
            {chatUsers.length}
          </h2>
        </div>
      </div>

      <div style={containerStyle}>
        {loading ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              Loading chats...
            </h3>
          </div>
        ) : chatUsers.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              No chats available 😅
            </h3>

            <p style={emptyText}>
              Accepted trip buddies will
              appear here.
            </p>

            <button
              onClick={() =>
                navigate("/home")
              }
              style={exploreBtn}
            >
              Explore Trips
            </button>
          </div>
        ) : (
          <div style={chatList}>
            {chatUsers.map((user) => {
              const imgUrl =
                getImageUrl(
                  user?.profileImage
                );

              const initial = user?.name
                ? user.name
                    .charAt(0)
                    .toUpperCase()
                : "U";

              return (
                <div
                  key={user._id}
                  onClick={() => {
                    if (user?._id) {
                      navigate(
                        `/chat/${user._id}`
                      );
                    }
                  }}
                  style={chatCard}
                >
                  <div style={avatar}>
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={
                          user?.name ||
                          "User"
                        }
                        style={avatarImg}
                      />
                    ) : (
                      <span
                        style={
                          avatarText
                        }
                      >
                        {initial}
                      </span>
                    )}
                  </div>

                  <div style={chatInfo}>
                    <div style={chatTop}>
                      <h3 style={userName}>
                        {user?.name ||
                          "Unknown User"}
                      </h3>

                      <span
                        style={
                          statusDot
                        }
                      >
                        ● Online
                      </span>
                    </div>

                    <p style={lastMsg}>
                      {user?.lastMessage ||
                        "No messages yet"}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (user?._id) {
                        navigate(
                          `/user/${user._id}`
                        );
                      }
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

export default Chats;