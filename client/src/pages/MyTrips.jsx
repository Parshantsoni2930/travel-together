import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyTrips, deleteTrip } from "../services/tripService";
import toast from "react-hot-toast";

const MyTrips = () => {
  const [trips, setTrips] = useState([]);
  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      const data = await getMyTrips();
      setTrips(data.trips || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading trips");
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this trip?");
    if (!confirmDelete) return;

    try {
      await deleteTrip(id);
      toast.success("Trip deleted successfully");
      fetchTrips();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting trip");
    }
  };

  const formatDate = (date) => {
    if (!date) return "Not added";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <span style={heroBadge}>Manage • Update • Explore</span>

        <h1 style={heroTitle}>My Trips</h1>

        <p style={heroText}>
          View, edit, and manage all your created trips in one place.
        </p>
      </div>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>Your Travel Plans</h2>

            <p style={subtitleStyle}>
              Keep your journeys updated and connect with more travelers.
            </p>
          </div>

          <button
            onClick={() => navigate("/create-trip")}
            style={createBtn}
          >
            + Create Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>No trips found 😅</h3>

            <p style={emptyText}>
              Create your first trip and find your perfect travel buddy.
            </p>

            <button
              onClick={() => navigate("/create-trip")}
              style={createBtn}
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {trips.map((trip) => (
              <div key={trip._id} style={tripCard}>
                <div style={cardTop}>
                  <h3 style={tripTitle}>{trip.destination}</h3>

                  <span style={typeBadge}>
                    {trip.travelType || "Trip"}
                  </span>
                </div>

                <p style={descStyle}>
                  {trip.description || "No description added."}
                </p>

                <div style={infoGrid}>
                  <div style={infoBox}>
                    <span style={infoLabel}>Budget</span>
                    <b>₹{trip.budget || "Not added"}</b>
                  </div>

                  <div style={infoBox}>
                    <span style={infoLabel}>Added</span>
                    <b>{formatDate(trip.createdAt || trip.updatedAt)}</b>
                  </div>

                  <div style={infoBox}>
                    <span style={infoLabel}>Start</span>
                    <b>{formatDate(trip.startDate || trip.date)}</b>
                  </div>

                  <div style={infoBox}>
                    <span style={infoLabel}>End</span>
                    <b>{formatDate(trip.endDate)}</b>
                  </div>
                </div>

                <div style={btnRow}>
                  <button
                    onClick={() => navigate(`/edit-trip/${trip._id}`)}
                    style={editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(trip._id)}
                    style={deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto 16px",
  padding: "28px",
  borderRadius: "28px",
  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.58)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#fff",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.08)",
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
  fontSize: "clamp(32px, 5vw, 58px)",
  fontWeight: "900",
  lineHeight: "1",
};

const heroText = {
  marginTop: "12px",
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#d4d4d4",
  maxWidth: "700px",
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

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "18px",
  flexWrap: "wrap",
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
  fontWeight: "900",
  color: "#ffffff",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#9ca3af",
  fontSize: "14px",
  lineHeight: "1.6",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "14px",
};

const tripCard = {
  padding: "18px",
  borderRadius: "22px",
  background: "#181818",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.28)",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
};

const tripTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "900",
};

const typeBadge = {
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "900",
  whiteSpace: "nowrap",
};

const descStyle = {
  color: "#a3a3a3",
  lineHeight: "1.6",
  marginTop: "12px",
  fontSize: "14px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "14px",
};

const infoBox = {
  padding: "12px",
  borderRadius: "16px",
  background: "#0b0b0b",
  color: "#ffffff",
  border: "1px solid rgba(255,255,255,0.06)",
};

const infoLabel = {
  display: "block",
  fontSize: "12px",
  color: "#9ca3af",
  marginBottom: "5px",
  fontWeight: "800",
};

const btnRow = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
};

const createBtn = {
  padding: "12px 18px",
  border: "none",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const editBtn = {
  flex: 1,
  padding: "12px",
  border: "none",
  borderRadius: "14px",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const deleteBtn = {
  flex: 1,
  padding: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "14px",
  background: "#0b0b0b",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
};

const emptyBox = {
  padding: "40px",
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

export default MyTrips;