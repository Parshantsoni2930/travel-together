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
        return;
      }

      if (msg.toLowerCase().includes("friend")) {
        setFriendStatus("friends");
        return;
      }

      toast.error(msg || "Error");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptFriendRequest(id);

      toast.success("Friend added!");
      setFriendStatus("friends");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
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

        <div style={heroSection}>
          <div style={heroOverlay}></div>

          <div style={heroContent}>
            <div style={avatarWrap}>
              {profileImg ? (
                <img
                  src={profileImg}
                  alt={user.name}
                  style={profileImgStyle}
                />
              ) : (
                <div style={avatarFallback}>
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>

            <div style={profileInfo}>
              <span style={heroBadge}>Traveler Profile</span>

              <h1 style={nameStyle}>{user.name || "User"}</h1>

              <p style={emailStyle}>
                {user.email || "Email not available"}
              </p>

              <div style={infoPills}>
                <span style={pillStyle}>
                  👥 {user.friends?.length || 0} Friends
                </span>

                <span style={pillStyle}>
                  📍 {user.city || "City not added"}
                </span>

                <span style={pillStyle}>
                  🎒 {userTrips.length} Trips
                </span>
              </div>

              {user.bio && <p style={bioStyle}>{user.bio}</p>}

              {Array.isArray(user.interests) &&
                user.interests.length > 0 && (
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
                      <button
                        onClick={handleAddBuddy}
                        style={primaryBtn}
                      >
                        Add Buddy
                      </button>
                    )}

                    {friendStatus === "sent" && (
                      <button disabled style={disabledBtn}>
                        Request Sent ✓
                      </button>
                    )}

                    {friendStatus === "received" && (
                      <button
                        onClick={handleAccept}
                        style={primaryBtn}
                      >
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
                  <button
                    onClick={() => navigate("/profile")}
                    style={primaryBtn}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={tripsSection}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>
              Trips by {user.name || "User"}
            </h2>

            <p style={sectionSub}>
              Explore travel plans created by this traveler.
            </p>
          </div>

          {userTrips.length === 0 ? (
            <div style={emptyBox}>
              No trips created yet.
            </div>
          ) : (
            <div style={tripGrid}>
              {userTrips.map((trip) => (
                <div
                  key={trip._id}
                  style={tripCard}
                  onClick={() => navigate(`/trip/${trip._id}`)}
                >
                  <div style={tripTop}>
                    <h3 style={tripTitle}>
                      {trip.destination}
                    </h3>

                    <span style={typeBadge}>
                      {trip.travelType || "Trip"}
                    </span>
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
  padding: "20px",
  background:
    "radial-gradient(circle at 15% 10%, rgba(124,58,237,0.14), transparent 28%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.10), transparent 25%), #050505",
  boxSizing: "border-box",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
};

const loadingBox = {
  maxWidth: "700px",
  margin: "120px auto",
  padding: "28px",
  borderRadius: "24px",
  background: "#111111",
  color: "#ffffff",
  fontWeight: "900",
  textAlign: "center",
  border: "1px solid rgba(255,255,255,0.08)",
};

const backBtn = {
  marginBottom: "16px",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const heroSection = {
  position: "relative",
  borderRadius: "30px",
  overflow: "hidden",
  padding: "34px",
  minHeight: "320px",
  display: "flex",
  alignItems: "center",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
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
  display: "flex",
  alignItems: "center",
  gap: "28px",
  flexWrap: "wrap",
  width: "100%",
};

const avatarWrap = {
  flexShrink: 0,
};

const profileImgStyle = {
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #ffffff",
};

const avatarFallback = {
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#000000",
  fontSize: "68px",
  fontWeight: "900",
};

const profileInfo = {
  flex: 1,
  minWidth: "280px",
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

const nameStyle = {
  margin: 0,
  fontSize: "clamp(40px, 6vw, 72px)",
  fontWeight: "900",
  color: "#ffffff",
  lineHeight: "1",
};

const emailStyle = {
  marginTop: "10px",
  color: "#d4d4d4",
  fontSize: "15px",
};

const infoPills = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "18px",
};

const pillStyle = {
  padding: "9px 14px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.10)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#ffffff",
  fontSize: "13px",
  fontWeight: "900",
};

const bioStyle = {
  marginTop: "18px",
  color: "#d4d4d4",
  fontSize: "15px",
  lineHeight: "1.7",
  maxWidth: "760px",
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
  background: "#ffffff",
  color: "#000000",
  fontSize: "12px",
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
  borderRadius: "14px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const disabledBtn = {
  ...primaryBtn,
  opacity: 0.6,
  cursor: "not-allowed",
};

const tripsSection = {
  marginTop: "16px",
  padding: "24px",
  borderRadius: "28px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
};

const sectionHeader = {
  marginBottom: "20px",
};

const sectionTitle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "900",
  color: "#ffffff",
};

const sectionSub = {
  marginTop: "8px",
  color: "#9ca3af",
};

const emptyBox = {
  padding: "28px",
  borderRadius: "20px",
  background: "#181818",
  color: "#9ca3af",
  fontWeight: "800",
  textAlign: "center",
};

const tripGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "14px",
};

const tripCard = {
  padding: "18px",
  borderRadius: "22px",
  background: "#181818",
  border: "1px solid rgba(255,255,255,0.06)",
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
  fontSize: "24px",
  fontWeight: "900",
  color: "#ffffff",
};

const typeBadge = {
  padding: "7px 11px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const tripDesc = {
  marginTop: "12px",
  color: "#a3a3a3",
  lineHeight: "1.6",
  fontSize: "14px",
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
  background: "#0b0b0b",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.06)",
};

const tripLabel = {
  display: "block",
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "4px",
  fontWeight: "800",
};

export default PublicProfile;