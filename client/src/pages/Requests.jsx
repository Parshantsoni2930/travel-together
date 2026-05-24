import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
} from "../services/requestService";

const Requests = () => {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState("");

  const getImageUrl = (img) => {
    if (!img) return "";

    if (img.startsWith("http"))
      return img;

    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/")
        ? img
        : `/${img}`
    }`;
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const data =
        await getReceivedRequests();

      setRequests(
        data.requests || []
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error loading requests"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (
    id
  ) => {
    try {
      setActionLoading(id);

      await acceptRequest(id);

      toast.success(
        "Trip buddy request accepted!"
      );

      setRequests((prev) =>
        prev.filter(
          (req) =>
            req._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error accepting request"
      );
    } finally {
      setActionLoading("");
    }
  };

  const handleReject = async (
    id
  ) => {
    try {
      setActionLoading(id);

      await rejectRequest(id);

      toast.success(
        "Trip buddy request rejected"
      );

      setRequests((prev) =>
        prev.filter(
          (req) =>
            req._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error rejecting request"
      );
    } finally {
      setActionLoading("");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>
            Connect • Accept • Travel
          </span>

          <h1 style={heroTitle}>
            Trip Requests
          </h1>

          <p style={heroText}>
            Manage incoming travel
            buddy requests and
            connect with travelers.
          </p>
        </div>

        <div style={statsGlass}>
          <span style={statsLabel}>
            Pending Requests
          </span>

          <h2 style={statsValue}>
            {requests.length}
          </h2>
        </div>
      </div>

      <div style={containerStyle}>
        {loading ? (
          <div style={emptyBox}>
            Loading requests...
          </div>
        ) : requests.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              No requests found
            </h3>

            <p style={emptyText}>
              New trip buddy
              requests will appear
              here.
            </p>
          </div>
        ) : (
          <div style={requestList}>
            {requests.map((req) => {
              const sender =
                req.sender || {};

              const trip =
                req.trip || {};

              const profileImg =
                getImageUrl(
                  sender?.profileImage
                );

              const initial =
                sender?.name
                  ? sender.name
                      .charAt(0)
                      .toUpperCase()
                  : "U";

              return (
                <div
                  key={req._id}
                  style={requestCard}
                >
                  <div
                    style={userInfo}
                  >
                    <div
                      style={
                        avatarBox
                      }
                    >
                      {profileImg ? (
                        <img
                          src={
                            profileImg
                          }
                          alt={
                            sender?.name ||
                            "User"
                          }
                          style={
                            avatarImg
                          }
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

                    <div>
                      <h3
                        style={
                          nameStyle
                        }
                      >
                        {sender?.name ||
                          "User"}
                      </h3>

                      <p
                        style={
                          emailStyle
                        }
                      >
                        {sender?.email ||
                          "No email"}
                      </p>

                      <p
                        style={
                          cityStyle
                        }
                      >
                        🧳 Trip:{" "}
                        {trip?.destination ||
                          "Trip not found"}
                      </p>
                    </div>
                  </div>

                  <div
                    style={
                      buttonBox
                    }
                  >
                    <button
                      onClick={() =>
                        handleAccept(
                          req._id
                        )
                      }
                      style={
                        acceptBtn
                      }
                      disabled={
                        actionLoading ===
                        req._id
                      }
                    >
                      {actionLoading ===
                      req._id
                        ? "Please wait..."
                        : "Accept"}
                    </button>

                    <button
                      onClick={() =>
                        handleReject(
                          req._id
                        )
                      }
                      style={
                        rejectBtn
                      }
                      disabled={
                        actionLoading ===
                        req._id
                      }
                    >
                      {actionLoading ===
                      req._id
                        ? "Please wait..."
                        : "Reject"}
                    </button>
                  </div>
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
  justifyContent:
    "space-between",
  alignItems: "flex-end",
  gap: "18px",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border:
    "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 14px 36px rgba(0,0,0,0.45)",
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
  background:
    "rgba(255,255,255,0.12)",
  border:
    "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "14px",
};

const heroTitle = {
  margin: 0,
  fontSize:
    "clamp(38px, 6vw, 70px)",
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
  background:
    "rgba(255,255,255,0.08)",
  border:
    "1px solid rgba(255,255,255,0.14)",
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
  border:
    "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 12px 30px rgba(0,0,0,0.35)",
  boxSizing: "border-box",
};

const requestList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const requestCard = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "18px",
  borderRadius: "22px",
  background: "#181818",
  border:
    "1px solid rgba(255,255,255,0.06)",
  flexWrap: "wrap",
};

const userInfo = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const avatarBox = {
  width: "72px",
  height: "72px",
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

const nameStyle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "900",
};

const emailStyle = {
  margin: "5px 0",
  color: "#9ca3af",
  fontSize: "13px",
};

const cityStyle = {
  margin: 0,
  color: "#d4d4d4",
  fontSize: "13px",
  fontWeight: "700",
};

const buttonBox = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const acceptBtn = {
  padding: "11px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#000000",
  fontWeight: "900",
  cursor: "pointer",
};

const rejectBtn = {
  padding: "11px 18px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  background: "#0b0b0b",
  color: "#ffffff",
  fontWeight: "900",
  cursor: "pointer",
};

const emptyBox = {
  padding: "40px",
  borderRadius: "24px",
  background: "#181818",
  textAlign: "center",
  border:
    "1px solid rgba(255,255,255,0.06)",
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
};

export default Requests;