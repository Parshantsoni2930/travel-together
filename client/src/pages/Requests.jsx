import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "../services/userService";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `https://travel-together-z3dr.onrender.com${img.startsWith("/") ? img : `/${img}`}`;
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getFriendRequests();
      setRequests(data.requests || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      await acceptFriendRequest(id);
      toast.success("Buddy request accepted!");
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error accepting request");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectFriendRequest(id);
      toast.success("Buddy request rejected");
      setRequests((prev) => prev.filter((req) => req._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error rejecting request");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <h2 style={titleStyle}>Buddy Requests 👥</h2>

        {loading ? (
          <div style={emptyBox}>Loading requests...</div>
        ) : requests.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={{ margin: 0 }}>No requests found</h3>
            <p style={{ color: "#64748b" }}>
              New buddy requests will appear here.
            </p>
          </div>
        ) : (
          <div style={requestList}>
            {requests.map((req) => {
              const profileImg = getImageUrl(req.profileImage);
              const initial = req.name
                ? req.name.charAt(0).toUpperCase()
                : "U";

              return (
                <div key={req._id} style={requestCard}>
                  <div style={userInfo}>
                    <div style={avatarBox}>
                      {profileImg ? (
                        <img src={profileImg} alt={req.name} style={avatarImg} />
                      ) : (
                        <span style={avatarText}>{initial}</span>
                      )}
                    </div>

                    <div>
                      <h3 style={nameStyle}>{req.name || "User"}</h3>
                      <p style={emailStyle}>{req.email || "No email"}</p>
                      <p style={cityStyle}>
                        📍 {req.city || "City not added"}
                      </p>
                    </div>
                  </div>

                  <div style={buttonBox}>
                    <button
                      onClick={() => handleAccept(req._id)}
                      style={acceptBtn}
                    >
                      Accept
                    </button>

                    <button
                      onClick={() => handleReject(req._id)}
                      style={rejectBtn}
                    >
                      Reject
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
  minHeight: "100vh",
  padding: "30px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const containerStyle = {
  maxWidth: "850px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const titleStyle = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#111827",
  fontSize: "28px",
  fontWeight: "900",
};

const requestList = {
  display: "flex",
  flexDirection: "column",
  gap: "14px",
};

const requestCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  padding: "16px",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
};

const userInfo = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const avatarBox = {
  width: "62px",
  height: "62px",
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
  fontSize: "24px",
  fontWeight: "900",
};

const nameStyle = {
  margin: 0,
  color: "#111827",
  fontSize: "18px",
};

const emailStyle = {
  margin: "4px 0",
  color: "#64748b",
  fontSize: "13px",
};

const cityStyle = {
  margin: 0,
  color: "#4f46e5",
  fontSize: "13px",
  fontWeight: "700",
};

const buttonBox = {
  display: "flex",
  gap: "10px",
};

const acceptBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #22c55e, #16a34a)",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
};

const rejectBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #ef4444, #dc2626)",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
};

const emptyBox = {
  padding: "30px",
  borderRadius: "18px",
  background: "#ffffff",
  textAlign: "center",
  fontWeight: "800",
};

export default Requests;