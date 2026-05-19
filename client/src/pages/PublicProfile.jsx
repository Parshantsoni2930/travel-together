import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPublicProfile,
  sendFriendRequest,
  acceptFriendRequest,
} from "../services/userService";
import { getAllTrips } from "../services/tripService";
import toast from "react-hot-toast";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [friendStatus, setFriendStatus] = useState("none");
  const [loading, setLoading] = useState(true);

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwnProfile = loggedInUser?._id === id;

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `https://travel-together-z3dr.onrender.com${
      img.startsWith("/") ? img : `/${img}`
    }`;
  };

  const formatDate = (date) => {
    if (!date) return "Not added";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const profileData = await getPublicProfile(id);
        setUser(profileData.user);
        setFriendStatus(profileData.friendStatus || "none");

        const tripsData = await getAllTrips();
        const filteredTrips = (tripsData.trips || []).filter(
          (trip) => trip.user?._id === id || trip.user === id
        );

        setUserTrips(filteredTrips);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading profile");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddBuddy = async () => {
    try {
      await sendFriendRequest(id);
      toast.success("Request sent!");
      setFriendStatus("sent");
    } catch (error) {
      const msg = error.response?.data?.message || "";

      if (msg.toLowerCase().includes("already")) {
        setFriendStatus("sent");
        toast.success("Request already sent");
        return;
      }

      if (msg.toLowerCase().includes("friend")) {
        setFriendStatus("friends");
        toast.success("Already friends");
        return;
      }

      toast.error(msg || "Error sending request");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptFriendRequest(id);
      toast.success("Friend added!");
      setFriendStatus("friends");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error accepting request");
    }
  };

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={loadingBox}>Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={pageStyle}>
        <div style={loadingBox}>Profile not found</div>
      </div>
    );
  }

  const profileImg = getImageUrl(user.profileImage);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
        </button>

        <div style={profileHero}>
          <div style={avatarWrap}>
            {profileImg ? (
              <img src={profileImg} alt={user.name} style={profileImgStyle} />
            ) : (
              <div style={avatarFallback}>
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div style={profileInfo}>
            <h1 style={nameStyle}>{user.name || "User"}</h1>
            <p style={emailStyle}>{user.email || "Email not added"}</p>

            <div style={infoPills}>
              <span style={pillStyle}>👥 {user.friends?.length || 0} Friends</span>
              <span style={pillStyle}>📍 {user.city || "City not added"}</span>
              <span style={pillStyle}>🎒 {userTrips.length} Trips</span>
            </div>

            {user.bio && <p style={bioStyle}>{user.bio}</p>}

            {Array.isArray(user.interests) && user.interests.length > 0 && (
              <div style={interestWrap}>
                {user.interests.map((interest, index) => (
                  <span key={index} style={interestBadge}>
                    {interest}
                  </span>
                ))}
              </div>
            )}

            <div style={actionRow}>
              {!isOwnProfile && (
                <>
                  {friendStatus === "none" && (
                    <button onClick={handleAddBuddy} style={primaryBtn}>
                      Add Buddy
                    </button>
                  )}

                  {friendStatus === "sent" && (
                    <button disabled style={disabledBtn}>
                      Request Sent ✓
                    </button>
                  )}

                  {friendStatus === "received" && (
                    <button onClick={handleAccept} style={primaryBtn}>
                      Accept Request
                    </button>
                  )}

                  {friendStatus === "friends" && (
                    <button disabled style={disabledBtn}>
                      Friends ✓
                    </button>
                  )}
                </>
              )}

              {isOwnProfile && (
                <button onClick={() => navigate("/profile")} style={primaryBtn}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div style={tripsSection}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Trips by {user.name || "User"} 🧳</h2>
            <p style={sectionSub}>Explore travel plans created by this user.</p>
          </div>

          {userTrips.length === 0 ? (
            <div style={emptyBox}>No trips created yet.</div>
          ) : (
            <div style={tripGrid}>
              {userTrips.map((trip) => (
                <div
                  key={trip._id}
                  style={tripCard}
                  onClick={() => navigate(`/trip/${trip._id}`)}
                >
                  <div style={tripTop}>
                    <h3 style={tripTitle}>{trip.destination}</h3>
                    <span style={typeBadge}>{trip.travelType || "Trip"}</span>
                  </div>

                  <p style={tripDesc}>
                    {trip.description || "No description added."}
                  </p>

                  <div style={tripInfoGrid}>
                    <div style={tripInfoBox}>
                      <span style={tripLabel}>Budget</span>
                      <b>₹{trip.budget || "Not added"}</b>
                    </div>

                    <div style={tripInfoBox}>
                      <span style={tripLabel}>Start</span>
                      <b>{formatDate(trip.startDate)}</b>
                    </div>

                    <div style={tripInfoBox}>
                      <span style={tripLabel}>End</span>
                      <b>{formatDate(trip.endDate)}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "36px 42px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
  boxSizing: "border-box",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
};

const loadingBox = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "34px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  color: "#111827",
  fontWeight: "900",
  textAlign: "center",
  boxShadow: "0 14px 35px rgba(0,0,0,0.35)",
};

const backBtn = {
  marginBottom: "22px",
  padding: "11px 18px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const profileHero = {
  display: "flex",
  gap: "32px",
  alignItems: "center",
  padding: "34px",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.38)",
  color: "#111827",
  flexWrap: "wrap",
};

const avatarWrap = {
  flexShrink: 0,
};

const profileImgStyle = {
  width: "190px",
  height: "190px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "6px solid #4f46e5",
  boxShadow: "0 12px 30px rgba(79,70,229,0.3)",
};

const avatarFallback = {
  width: "190px",
  height: "190px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "72px",
  fontWeight: "900",
  boxShadow: "0 12px 30px rgba(79,70,229,0.3)",
};

const profileInfo = {
  flex: 1,
  minWidth: "280px",
};

const nameStyle = {
  margin: 0,
  fontSize: "42px",
  fontWeight: "900",
  color: "#111827",
};

const emailStyle = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "15px",
};

const infoPills = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const pillStyle = {
  padding: "9px 14px",
  borderRadius: "999px",
  background: "#e0e7ff",
  color: "#3730a3",
  fontSize: "13px",
  fontWeight: "900",
};

const bioStyle = {
  marginTop: "18px",
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.7",
};

const interestWrap = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
};

const interestBadge = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #dbeafe, #fce7f3)",
  color: "#312e81",
  fontSize: "13px",
  fontWeight: "900",
};

const actionRow = {
  display: "flex",
  gap: "12px",
  marginTop: "22px",
  flexWrap: "wrap",
};

const primaryBtn = {
  padding: "12px 20px",
  borderRadius: "999px",
  border: "none",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
  boxShadow: "0 10px 22px rgba(79,70,229,0.3)",
};

const disabledBtn = {
  ...primaryBtn,
  background: "#94a3b8",
  cursor: "not-allowed",
  boxShadow: "none",
};

const tripsSection = {
  marginTop: "28px",
  padding: "30px",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.38)",
  color: "#111827",
};

const sectionHeader = {
  marginBottom: "22px",
};

const sectionTitle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "900",
  color: "#111827",
};

const sectionSub = {
  marginTop: "8px",
  color: "#64748b",
};

const emptyBox = {
  padding: "28px",
  borderRadius: "20px",
  background: "#fff",
  color: "#64748b",
  fontWeight: "800",
  textAlign: "center",
};

const tripGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const tripCard = {
  padding: "22px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  border: "1px solid #e2e8f0",
  boxShadow: "0 10px 24px rgba(15,23,42,0.14)",
  cursor: "pointer",
};

const tripTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
};

const tripTitle = {
  margin: 0,
  fontSize: "23px",
  fontWeight: "900",
  color: "#111827",
};

const typeBadge = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
  color: "#312e81",
  fontSize: "12px",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const tripDesc = {
  marginTop: "12px",
  color: "#475569",
  lineHeight: "1.6",
};

const tripInfoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "10px",
  marginTop: "16px",
};

const tripInfoBox = {
  padding: "12px",
  borderRadius: "16px",
  background: "#eef2ff",
  color: "#111827",
};

const tripLabel = {
  display: "block",
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "4px",
  fontWeight: "800",
};

export default PublicProfile;