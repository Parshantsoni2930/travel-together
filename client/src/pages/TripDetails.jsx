import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTripById } from "../services/tripService";
import { sendRequest } from "../services/requestService";
import toast from "react-hot-toast";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const formatDate = (date) => {
    if (!date) return "Not added";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const data = await getTripById(id);
        setTrip(data.trip);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading trip");
      }
    };

    fetchTrip();
  }, [id]);

  const handleRequest = async () => {
    const receiverId =
      trip?.user?._id ||
      trip?.user ||
      trip?.createdBy?._id ||
      trip?.createdBy;

    const tripId = trip?._id;

    const currentUser = JSON.parse(localStorage.getItem("user"));

    if (!receiverId || !tripId) {
      toast.error("Trip owner or trip id missing");
      return;
    }

    if (currentUser?._id === receiverId) {
      toast.error("You cannot request your own trip");
      return;
    }

    try {
      setLoading(true);

      await sendRequest({
        receiverId,
        tripId,
      });

      setRequestSent(true);
      toast.success("Request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    } finally {
      setLoading(false);
    }
  };

  if (!trip) {
    return (
      <div style={pageStyle}>
        <div style={loadingBox}>Loading trip...</div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <div style={heroOverlay}></div>

        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
        </button>

        <div style={heroContent}>
          <span style={typeBadge}>{trip.travelType || "Trip"}</span>

          <h1 style={titleStyle}>{trip.destination}</h1>

          <p style={descStyle}>
            {trip.description || "No description added."}
          </p>
        </div>

        <div style={budgetGlass}>
          <span style={budgetLabel}>Budget</span>

          <h2 style={budgetValue}>₹{trip.budget || "Not added"}</h2>
        </div>
      </div>

      <div style={containerStyle}>
        <div style={infoGrid}>
          <div style={infoCard}>
            <span style={infoLabel}>📅 Added On</span>
            <b>{formatDate(trip.createdAt || trip.updatedAt)}</b>
          </div>

          <div style={infoCard}>
            <span style={infoLabel}>🗓️ Start Date</span>
            <b>{formatDate(trip.startDate || trip.date)}</b>
          </div>

          <div style={infoCard}>
            <span style={infoLabel}>⏳ End Date</span>
            <b>{formatDate(trip.endDate)}</b>
          </div>

          <div style={infoCard}>
            <span style={infoLabel}>👤 Posted By</span>
            <b>{trip.user?.name || "Unknown"}</b>
          </div>
        </div>

        <div style={actionCard}>
          <div>
            <h3 style={actionTitle}>Interested in this trip?</h3>

            <p style={actionText}>
              View the traveler profile or send a request to join this journey.
            </p>
          </div>

          <div style={btnRow}>
            <button
              onClick={() => {
                if (trip?.user?._id) {
                  navigate(`/user/${trip.user._id}`);
                }
              }}
              style={profileBtn}
              disabled={!trip.user?._id}
            >
              View Profile
            </button>

            <button
              onClick={handleRequest}
              style={requestBtn}
              disabled={loading || requestSent}
            >
              {loading
                ? "Sending..."
                : requestSent
                ? "Request Sent"
                : "Request to Join"}
            </button>
          </div>
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

const heroSection = {
  position: "relative",
  width: "100%",
  maxWidth: "1400px",
  minHeight: "330px",
  margin: "0 auto 16px",
  padding: "28px",
  borderRadius: "30px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.08)",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.82), rgba(0,0,0,0.52), rgba(0,0,0,0.22))",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  maxWidth: "760px",
};

const backBtn = {
  position: "relative",
  zIndex: 2,
  width: "fit-content",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid rgba(255,255,255,0.15)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
  backdropFilter: "blur(8px)",
};

const typeBadge = {
  display: "inline-block",
  padding: "8px 13px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.14)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#ffffff",
  fontWeight: "900",
  fontSize: "12px",
  marginBottom: "16px",
};

const titleStyle = {
  margin: 0,
  fontSize: "clamp(38px, 6vw, 74px)",
  fontWeight: "900",
  lineHeight: "1",
  color: "#ffffff",
};

const descStyle = {
  marginTop: "14px",
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "15px",
  maxWidth: "700px",
};

const budgetGlass = {
  position: "relative",
  zIndex: 2,
  width: "fit-content",
  padding: "18px 22px",
  borderRadius: "22px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(12px)",
  color: "#ffffff",
};

const budgetLabel = {
  display: "block",
  color: "#d4d4d4",
  fontSize: "13px",
  marginBottom: "6px",
  fontWeight: "800",
};

const budgetValue = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "900",
};

const containerStyle = {
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
};

const infoCard = {
  padding: "18px",
  borderRadius: "22px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#ffffff",
  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
};

const infoLabel = {
  display: "block",
  color: "#9ca3af",
  fontSize: "12px",
  marginBottom: "8px",
  fontWeight: "900",
};

const actionCard = {
  marginTop: "16px",
  padding: "22px",
  borderRadius: "26px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
};

const actionTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
};

const actionText = {
  color: "#9ca3af",
  marginTop: "8px",
  marginBottom: 0,
  lineHeight: "1.6",
};

const btnRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const profileBtn = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const requestBtn = {
  padding: "12px 18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#0b0b0b",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
};

const loadingBox = {
  maxWidth: "420px",
  margin: "100px auto",
  padding: "24px",
  borderRadius: "22px",
  background: "#111111",
  color: "#ffffff",
  textAlign: "center",
  fontWeight: "900",
  border: "1px solid rgba(255,255,255,0.08)",
};

export default TripDetails;