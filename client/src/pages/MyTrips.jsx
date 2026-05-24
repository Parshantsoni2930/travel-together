import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getMyTrips,
  deleteTrip,
} from "../services/tripService";

import toast from "react-hot-toast";

const MyTrips = () => {
  const [trips, setTrips] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const data =
        await getMyTrips();

      setTrips(data.trips || []);
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error loading trips"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this trip?"
      );

    if (!confirmDelete) return;

    try {
      await deleteTrip(id);

      toast.success(
        "Trip deleted successfully"
      );

      setTrips((prev) =>
        prev.filter(
          (trip) =>
            trip._id !== id
        )
      );
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error deleting trip"
      );
    }
  };

  const formatDate = (date) => {
    if (!date)
      return "Not added";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <span style={heroBadge}>
          Manage • Update • Explore
        </span>

        <h1 style={heroTitle}>
          My Trips
        </h1>

        <p style={heroText}>
          View, edit, and manage
          all your created trips
          in one place.
        </p>
      </div>

      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h2 style={titleStyle}>
              Your Travel Plans
            </h2>

            <p
              style={subtitleStyle}
            >
              Keep your journeys
              updated and connect
              with more travelers.
            </p>
          </div>

          <button
            onClick={() =>
              navigate(
                "/create-trip"
              )
            }
            style={createBtn}
          >
            + Create Trip
          </button>
        </div>

        {loading ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              Loading trips...
            </h3>
          </div>
        ) : trips.length === 0 ? (
          <div style={emptyBox}>
            <h3 style={emptyTitle}>
              No trips found 😅
            </h3>

            <p style={emptyText}>
              Create your first
              trip and find your
              perfect travel buddy.
            </p>

            <button
              onClick={() =>
                navigate(
                  "/create-trip"
                )
              }
              style={createBtn}
            >
              Create Trip
            </button>
          </div>
        ) : (
          <div style={gridStyle}>
            {trips.map((trip) => (
              <div
                key={trip._id}
                style={tripCard}
              >
                <div
                  style={cardTop}
                >
                  <h3
                    style={
                      tripTitle
                    }
                  >
                    {
                      trip.destination
                    }
                  </h3>

                  <span
                    style={
                      typeBadge
                    }
                  >
                    {trip.travelType ||
                      "Trip"}
                  </span>
                </div>

                <p style={descStyle}>
                  {trip.description ||
                    "No description added."}
                </p>

                <div
                  style={infoGrid}
                >
                  <div
                    style={
                      infoBox
                    }
                  >
                    <span
                      style={
                        infoLabel
                      }
                    >
                      Budget
                    </span>

                    <b>
                      ₹
                      {trip.budget ||
                        "Not added"}
                    </b>
                  </div>

                  <div
                    style={
                      infoBox
                    }
                  >
                    <span
                      style={
                        infoLabel
                      }
                    >
                      Added
                    </span>

                    <b>
                      {formatDate(
                        trip.createdAt ||
                          trip.updatedAt
                      )}
                    </b>
                  </div>

                  <div
                    style={
                      infoBox
                    }
                  >
                    <span
                      style={
                        infoLabel
                      }
                    >
                      Start
                    </span>

                    <b>
                      {formatDate(
                        trip.startDate
                      )}
                    </b>
                  </div>

                  <div
                    style={
                      infoBox
                    }
                  >
                    <span
                      style={
                        infoLabel
                      }
                    >
                      End
                    </span>

                    <b>
                      {formatDate(
                        trip.endDate
                      )}
                    </b>
                  </div>
                </div>

                <div style={btnRow}>
                  <button
                    onClick={() =>
                      navigate(
                        `/edit-trip/${trip._id}`
                      )
                    }
                    style={editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        trip._id
                      )
                    }
                    style={
                      deleteBtn
                    }
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
  margin: "0 auto 18px",
  padding: "30px",
  borderRadius: "30px",
  backgroundImage:
    "linear-gradient(rgba(0,0,0,0.58), rgba(0,0,0,0.58)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  color: "#ffffff",
  border:
    "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 14px 36px rgba(0,0,0,0.45)",
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
    "clamp(34px, 5vw, 60px)",
  fontWeight: "900",
  lineHeight: "1",
};

const heroText = {
  marginTop: "12px",
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "15px",
  maxWidth: "700px",
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

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "14px",
  marginBottom: "24px",
  flexWrap: "wrap",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "900",
  color: "#ffffff",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#9ca3af",
  fontSize: "14px",
};

const createBtn = {
  padding: "14px 22px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "14px",
};

const emptyBox = {
  width: "100%",
  minHeight: "300px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

const emptyTitle = {
  color: "#ffffff",
  marginBottom: "10px",
};

const emptyText = {
  color: "#9ca3af",
  marginBottom: "18px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

const tripCard = {
  padding: "20px",
  borderRadius: "24px",
  background: "#181818",
  border:
    "1px solid rgba(255,255,255,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const cardTop = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
};

const tripTitle = {
  margin: 0,
  color: "#ffffff",
  fontSize: "22px",
  fontWeight: "900",
};

const typeBadge = {
  padding: "8px 12px",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,0.08)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "800",
};

const descStyle = {
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "14px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(2, 1fr)",
  gap: "12px",
};

const infoBox = {
  padding: "14px",
  borderRadius: "18px",
  background: "#101010",
  border:
    "1px solid rgba(255,255,255,0.05)",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  color: "#ffffff",
};

const infoLabel = {
  color: "#9ca3af",
  fontSize: "12px",
  fontWeight: "700",
};

const btnRow = {
  display: "flex",
  gap: "12px",
  marginTop: "6px",
};

const editBtn = {
  flex: 1,
  padding: "13px",
  borderRadius: "14px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const deleteBtn = {
  flex: 1,
  padding: "13px",
  borderRadius: "14px",
  border: "none",
  background: "#ef4444",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
};

export default MyTrips;