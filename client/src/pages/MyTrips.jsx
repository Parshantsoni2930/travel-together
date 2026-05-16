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
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>My Trips 🧳</h2>
            <p style={subtitleStyle}>
              Manage your created trips, update plans, or remove old trips.
            </p>
          </div>

          <button onClick={() => navigate("/create-trip")} style={createBtn}>
            + Create Trip
          </button>
        </div>

        {trips.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={{ margin: 0 }}>No trips found 😅</h3>
            <p style={{ color: "#64748b" }}>
              Create your first trip and find your travel buddy.
            </p>
            <button onClick={() => navigate("/create-trip")} style={createBtn}>
              Create Trip
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {trips.map((trip) => (
              <div key={trip._id} style={tripCard}>
                <div style={cardTop}>
                  <h3 style={tripTitle}>{trip.destination}</h3>
                  <span style={typeBadge}>{trip.travelType || "Trip"}</span>
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
  minHeight: "100vh",
  padding: "24px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const containerStyle = {
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "22px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "15px",
  marginBottom: "20px",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "900",
  color: "#111827",
};

const subtitleStyle = {
  margin: "6px 0 0",
  color: "#64748b",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "18px",
};

const tripCard = {
  padding: "18px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  boxShadow: "0 8px 20px rgba(15,23,42,0.18)",
  border: "1px solid #e2e8f0",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "10px",
};

const tripTitle = {
  margin: 0,
  color: "#111827",
  fontSize: "22px",
};

const typeBadge = {
  padding: "7px 10px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #dbeafe, #ede9fe)",
  color: "#312e81",
  fontSize: "12px",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const descStyle = {
  color: "#475569",
  lineHeight: "1.5",
  minHeight: "45px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  marginTop: "14px",
};

const infoBox = {
  padding: "10px",
  borderRadius: "14px",
  background: "#eef2ff",
  color: "#111827",
};

const infoLabel = {
  display: "block",
  fontSize: "12px",
  color: "#64748b",
  marginBottom: "4px",
};

const btnRow = {
  display: "flex",
  gap: "10px",
  marginTop: "16px",
};

const createBtn = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
};

const editBtn = {
  flex: 1,
  padding: "10px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
};

const deleteBtn = {
  flex: 1,
  padding: "10px",
  border: "none",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #ef4444, #f97316)",
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

export default MyTrips;