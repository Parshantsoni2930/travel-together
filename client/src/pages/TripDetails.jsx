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
    if (!trip?.user?._id) return;

    try {
      setLoading(true);

      await sendRequest({
        receiverId: trip.user._id,
        tripId: trip._id,
      });

      alert("Request sent!");
    } catch (error) {
      alert(error.response?.data?.message || "Error sending request");
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
      <div style={containerStyle}>
        <button onClick={() => navigate(-1)} style={backBtn}>
          ← Back
        </button>

        <div style={heroCard}>
          <div>
            <span style={typeBadge}>{trip.travelType || "Trip"}</span>
            <h1 style={titleStyle}>{trip.destination}</h1>
            <p style={descStyle}>
              {trip.description || "No description added."}
            </p>
          </div>

          <div style={budgetBox}>
            <span style={smallText}>Budget</span>
            <h2 style={{ margin: 0 }}>₹{trip.budget || "Not added"}</h2>
          </div>
        </div>

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
            <h3 style={{ margin: 0 }}>Interested in this trip?</h3>
            <p style={{ color: "#64748b", marginBottom: 0 }}>
              View the traveler profile or send a request to join.
            </p>
          </div>

          <div style={btnRow}>
            <button
              onClick={() => navigate(`/user/${trip.user._id}`)}
              style={profileBtn}
              disabled={!trip.user?._id}
            >
              View Profile
            </button>

            <button onClick={handleRequest} style={requestBtn} disabled={loading}>
              {loading ? "Sending..." : "Request to Join"}
            </button>
          </div>
        </div>
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
  maxWidth: "1050px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const backBtn = {
  marginBottom: "16px",
  padding: "9px 14px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
};

const heroCard = {
  padding: "26px",
  borderRadius: "24px",
  background:
    "linear-gradient(135deg, rgba(79,70,229,0.95), rgba(236,72,153,0.9))",
  color: "#fff",
  display: "flex",
  justifyContent: "space-between",
  gap: "20px",
  boxShadow: "0 10px 25px rgba(79,70,229,0.28)",
};

const typeBadge = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.18)",
  fontWeight: "900",
  fontSize: "13px",
};

const titleStyle = {
  margin: "16px 0 8px",
  fontSize: "38px",
  fontWeight: "900",
};

const descStyle = {
  margin: 0,
  lineHeight: "1.6",
  maxWidth: "680px",
};

const budgetBox = {
  minWidth: "170px",
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.16)",
  alignSelf: "flex-start",
};

const smallText = {
  display: "block",
  fontSize: "13px",
  marginBottom: "6px",
  opacity: 0.85,
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "15px",
  marginTop: "18px",
};

const infoCard = {
  padding: "16px",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
};

const infoLabel = {
  display: "block",
  color: "#64748b",
  fontSize: "13px",
  marginBottom: "7px",
  fontWeight: "800",
};

const actionCard = {
  marginTop: "18px",
  padding: "20px",
  borderRadius: "20px",
  background: "#ffffff",
  boxShadow: "0 8px 20px rgba(15,23,42,0.12)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "18px",
  flexWrap: "wrap",
};

const btnRow = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
};

const profileBtn = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const requestBtn = {
  padding: "11px 16px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const loadingBox = {
  maxWidth: "420px",
  margin: "80px auto",
  padding: "24px",
  borderRadius: "18px",
  background: "#ffffff",
  textAlign: "center",
  fontWeight: "900",
};

export default TripDetails;