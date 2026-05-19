import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTrips } from "../services/tripService";
import { sendRequest } from "../services/requestService";
import toast from "react-hot-toast";

const touristPlaces = [
  { name: "Manali", image: "/images/manali.jpg", summary: "Snowy mountains & chill vibes." },
  { name: "Goa", image: "/images/goa.jpg", summary: "Beaches & nightlife." },
  { name: "Rishikesh", image: "/images/rishikesh.jpg", summary: "Rafting & spiritual vibes." },
  { name: "Jaipur", image: "/images/jaipur.jpg", summary: "Forts & royal culture." },
  { name: "Kedarnath", image: "/images/kedarnath.jpg", summary: "Spiritual Himalayan temple." },
  { name: "Leh Ladakh", image: "/images/ladakh.jpg", summary: "Mountains & bike trips." },
  { name: "Udaipur", image: "/images/udaipur.jpg", summary: "City of lakes." },
  { name: "Andaman", image: "/images/andaman.jpg", summary: "Island beaches." },
  { name: "Darjeeling", image: "/images/darjeeling.jpg", summary: "Tea gardens." },
  { name: "Kerala", image: "/images/kerala.jpg", summary: "Backwaters & greenery." },
  { name: "Zainabad", image: "/images/zainabad.jpg", summary: "SIET", },
];

const formatDate = (date) => {
  if (!date) return "Not added";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Home = () => {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips();
        setTrips(data.trips || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTrips();
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch = trip.destination
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesType = typeFilter ? trip.travelType === typeFilter : true;

    return matchesSearch && matchesType;
  });

  const handleRequest = async (trip) => {
    try {
      await sendRequest({
        receiverId: trip.user._id,
        tripId: trip._id,
      });

      toast.success("Request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    }
  };

  return (
    <div style={pageStyle}>
      <section style={heroSection}>
        <div>
          <h1 style={heroTitle}>Find Your Perfect Travel Buddy 🌍</h1>
          <p style={heroText}>
            Explore trips, discover places, and connect with travelers who match your vibe.
          </p>
        </div>
      </section>

      <div style={searchBar}>
        <input
          type="text"
          placeholder="Search destination..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInput}
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={searchSelect}
        >
          <option value="">All Types</option>
          <option value="Adventure">Adventure</option>
          <option value="Beach">Beach</option>
          <option value="Mountains">Mountains</option>
          <option value="Temple">Temple</option>
          <option value="Trekking">Trekking</option>
          <option value="City">City</option>
          <option value="Road Trip">Road Trip</option>
          <option value="Other">Other</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setTypeFilter("");
          }}
          style={clearBtn}
        >
          Clear
        </button>
      </div>

      <div style={mainGrid}>
        <div style={sectionBox}>
          <h2 style={sectionTitle}>Latest Trips 🧳</h2>

          <div style={tripList}>
            {filteredTrips.length === 0 ? (
              <p style={emptyText}>No trips found</p>
            ) : (
              filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  style={tripCard}
                  onClick={() => navigate(`/trip/${trip._id}`)}
                >
                  <h3 style={tripTitle}>{trip.destination}</h3>

                  <div style={infoGrid}>
                    <p style={infoText}>
                      <b>Budget:</b> ₹{trip.budget}
                    </p>
                    <p style={infoText}>
                      <b>Type:</b> {trip.travelType}
                    </p>
                    <p style={infoText}>
                      <b>By:</b> {trip.user?.name || "Unknown"}
                    </p>
                  </div>

                  <div style={dateRow}>
                    <span style={dateBadge}>📅 Created: {formatDate(trip.createdAt)}</span>
                    <span style={dateBadge}>🗓️ Start: {formatDate(trip.startDate)}</span>
                    <span style={dateBadge}>⏳ End: {formatDate(trip.endDate)}</span>
                  </div>

                  <p style={description}>{trip.description}</p>

                  <div style={buttonRow}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/${trip.user._id}`);
                      }}
                      style={btnBlue}
                    >
                      View Profile
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRequest(trip);
                      }}
                      style={btnGreen}
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={sectionBox}>
          <h2 style={sectionTitle}>Explore Places 🌍</h2>

          <div style={placesList}>
            {touristPlaces.map((place, index) => (
              <div
                key={index}
                style={placeCard}
                onClick={() =>
                  navigate("/ai-planner", {
                    state: { placeName: place.name },
                  })
                }
              >
                <img src={place.image} alt={place.name} style={placeImg} />

                <div style={overlay}>
                  <h4 style={placeTitle}>{place.name}</h4>
                  <p style={placeSummary}>{place.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "24px",
  background: "#050505",
};
const heroSection = {
  width: "100%",
  padding: "38px",
  marginBottom: "26px",
  borderRadius: "30px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.45)",
  color: "#ffffff",
};

const heroTitle = {
  fontSize: "clamp(34px, 5vw, 58px)",
  lineHeight: "1.1",
  fontWeight: "900",
  marginBottom: "14px",
  color: "#ffffff",
};

const heroText = {
  fontSize: "18px",
  lineHeight: "1.7",
  color: "#a3a3a3",
  maxWidth: "850px",
};

const searchBar = {
  width: "100%",
  display: "flex",
  gap: "14px",
  marginBottom: "26px",
  flexWrap: "wrap",
  padding: "18px",
  borderRadius: "22px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
};

const searchInput = {
  flex: 1,
  minWidth: "240px",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  fontSize: "15px",
  background: "#181818",
  color: "#ffffff",
};

const searchSelect = {
  minWidth: "180px",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  fontSize: "15px",
  background: "#181818",
  color: "#ffffff",
};

const clearBtn = {
  padding: "14px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "26px",
  width: "100%",
  alignItems: "start",
};

if (window.innerWidth <= 1000) {
  mainGrid.gridTemplateColumns = "1fr";
}

const sectionBox = {
  width: "100%",
  padding: "24px",
  borderRadius: "28px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
  color: "#ffffff",
  overflow: "hidden",
  minWidth: 0,
};

const sectionTitle = {
  fontSize: "28px",
  fontWeight: "900",
  marginBottom: "18px",
  color: "#ffffff",
};

const tripList = {
  display: "flex",
  flexDirection: "column",
  gap: "18px",
};

const tripCard = {
  width: "100%",
  padding: "24px",
  borderRadius: "24px",
  background: "#181818",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.3)",
  cursor: "pointer",
  overflow: "hidden",
};


const tripTitle = {
  fontSize: "clamp(20px, 3vw, 28px)",
  fontWeight: "900",
  marginBottom: "14px",
  color: "#ffffff",
  wordBreak: "break-word",
};

const infoText = {
  color: "#d4d4d4",
  fontSize: "15px",
  lineHeight: "1.6",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "10px",
  marginBottom: "14px",
};


const dateRow = {
  display: "flex",
  gap: "10px",
  margin: "12px 0",
  flexWrap: "wrap",
};

const dateBadge = {
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "900",
};

const description = {
  color: "#a3a3a3",
  fontSize: "15px",
  lineHeight: "1.7",
  marginTop: "12px",
  marginBottom: "16px",
};

const buttonRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const btnBlue = {
  padding: "11px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const btnGreen = {
  padding: "11px 16px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const emptyText = {
  color: "#64748b",
  fontSize: "16px",
};

const placesList = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
};


const placeCard = {
  position: "relative",
  height: "170px",
  borderRadius: "24px",
  overflow: "hidden",
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 24px rgba(0,0,0,0.35)",
};

const placeImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const overlay = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  padding: "16px",
  background: "linear-gradient(to top, rgba(0,0,0,0.78), transparent)",
  color: "#fff",
};

const placeTitle = {
  fontSize: "20px",
  fontWeight: "900",
  marginBottom: "4px",
};

const placeSummary = {
  fontSize: "14px",
  lineHeight: "1.4",
  color: "#e5e7eb",
};

export default Home;