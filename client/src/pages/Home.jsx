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
  const [isMobile, setIsMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

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
      alert(error.response?.data?.message || "Error sending request");
    }
  };

  return (
    <div style={pageStyle}>
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

      <div
        style={{
          ...mainGrid,
          gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
        }}
      >
        <div style={sectionBox}>
          <h3 style={{ color: "#111827" }}>Latest Trips 🧳</h3>

          {filteredTrips.length === 0 ? (
            <p style={{ color: "#64748b" }}>No trips found</p>
          ) : (
            filteredTrips.map((trip) => (
              <div
               key={trip._id} style={tripCard}
               onClick={() => navigate(`/trip/${trip._id}`)}
             >
                <h3>{trip.destination}</h3>

                <p>
                  <b>Budget:</b> ₹{trip.budget}
                </p>
                <p>
                  <b>Type:</b> {trip.travelType}
                </p>

                <div style={dateRow}>
                  <span style={dateBadge}>📅 {formatDate(trip.createdAt)}</span>
                  <span style={dateBadge}>🗓️ {formatDate(trip.startDate)}</span>
                  <span style={dateBadge}>⏳ {formatDate(trip.endDate)}</span>
                </div>

                <p style={{ color: "#475569" }}>{trip.description}</p>
                <p>
                  <b>By:</b> {trip.user?.name || "Unknown"}
                </p>

                <button
                 onClick={(e) => {
                 e.stopPropagation();
                 navigate(`/user/${trip.user._id}`);
                  }}
                 style={btnBlue}
                 >
                  Profile
                </button>

                <button
                onClick={(e) => {
                  e.stopPropagation();
                 handleRequest(trip);
                 }}
                 style={btnGreen}
                >
                Request
              </button>
              </div>
              ))
                )}
              </div>

              <div style={sectionBox}>
             <h3>Explore Places 🌍</h3>

              {touristPlaces.map((place, index) => (
              <div
              key={index}
              style={placeCard}
              onClick={() =>
                navigate("/ai-planner", {
                  state: { placeName: place.name },
                })
              }
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector("img").style.transform =
                  "scale(1.1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector("img").style.transform =
                  "scale(1)")
              }
            >
              <img src={place.image} alt={place.name} style={placeImg} />

              <div style={overlay}>
                <h4 style={{ margin: 0 }}>{place.name}</h4>
                <p style={{ margin: "4px 0 0" }}>{place.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const pageStyle = {
  padding: "20px",
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const searchBar = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
  flexWrap: "wrap",
  padding: "14px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.28)",
};

const searchInput = {
  flex: 1,
  minWidth: "220px",
  padding: "13px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const searchSelect = {
  padding: "13px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const clearBtn = {
  padding: "13px 18px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #ef4444, #f97316)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "800",
};

const mainGrid = {
  display: "grid",
  gap: "20px",
};

const sectionBox = {
  padding: "18px",
  borderRadius: "18px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const tripCard = {
  margin: "14px 0",
  padding: "16px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #ffffff, #f1f5f9)",
  boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
  cursor: "pointer",
};

const dateRow = {
  display: "flex",
  gap: "10px",
  margin: "10px 0",
  flexWrap: "wrap",
};

const dateBadge = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#e0e7ff",
  fontSize: "12px",
  fontWeight: "700",
};

const placeCard = {
  position: "relative",
  height: "140px",
  borderRadius: "16px",
  overflow: "hidden",
  marginBottom: "15px",
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
};

const placeImg = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "0.4s",
};

const overlay = {
  position: "absolute",
  bottom: 0,
  width: "100%",
  padding: "10px",
  background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
  color: "#fff",
};

const btnBlue = {
  marginRight: "10px",
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#4f46e5",
  color: "#fff",
  cursor: "pointer",
};

const btnGreen = {
  padding: "8px 12px",
  borderRadius: "8px",
  border: "none",
  background: "#10b981",
  color: "#fff",
  cursor: "pointer",
};

export default Home;