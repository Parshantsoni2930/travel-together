import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTrips } from "../services/tripService";
import { sendRequest } from "../services/requestService";
import { getStats } from "../services/statsService";
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
  { name: "Zainabad", image: "/images/zainabad.jpg", summary: "SIET" },
];

const categories = [
  { name: "Adventure", icon: "🧗" },
  { name: "Beach", icon: "🏖️" },
  { name: "Mountains", icon: "🏔️" },
  { name: "Trekking", icon: "🥾" },
  { name: "Road Trip", icon: "🚗" },
  { name: "Temple", icon: "🛕" },
  { name: "City", icon: "🌆" },
  { name: "Other", icon: "✨" },
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
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [requestLoading, setRequestLoading] = useState("");

  const [stats, setStats] = useState({
    usersCount: 0,
    tripsCount: 0,
    requestsCount: 0,
    destinationsCount: 0,
  });

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips();
        setTrips(data.trips || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading trips");
      }
    };

    fetchTrips();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data || {});
      } catch (error) {
        console.log(error);
      }
    };

    fetchStats();
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
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");

      const receiverId = trip?.user?._id || trip?.user;
      const tripId = trip?._id;

      if (!receiverId || !tripId) {
        toast.error("Trip data missing");
        return;
      }

      if (currentUser?._id === receiverId) {
        toast.error("You cannot request your own trip");
        return;
      }

      setRequestLoading(tripId);

      await sendRequest({
        receiverId,
        tripId,
      });

      toast.success("Request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error sending request");
    } finally {
      setRequestLoading("");
    }
  };

  const getCategoryCount = (type) => {
    return trips.filter((trip) => trip.travelType === type).length;
  };

  return (
    <div style={pageStyle}>
      <section style={heroSection}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>Explore • Connect • Travel</span>

          <h1 style={heroTitle}>Find Your Perfect Travel Buddy</h1>

          <p style={heroText}>
            Discover trips, explore destinations, and connect with travelers who
            match your vibe.
          </p>

          <div style={heroButtons}>
            <button
              onClick={() => navigate("/create-trip")}
              style={primaryHeroBtn}
            >
              Create Trip
            </button>

            <button
              onClick={() =>
                document
                  .getElementById("latest-trips")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              style={secondaryHeroBtn}
            >
              Explore Trips
            </button>
          </div>
        </div>

        <div style={heroGlassCard}>
          <h3 style={glassTitle}>Popular Now</h3>
          <p style={glassText}>Manali • Goa • Rishikesh</p>
          <span style={glassPill}>Live travel plans</span>
        </div>
      </section>

      <section style={searchBar}>
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
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
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
      </section>

      <section style={categoriesSection}>
        <div style={sectionHeader}>
          <h2 style={sectionTitle}>Top Categories</h2>
          <p style={sectionSubtitle}>
            Choose your travel style and find matching trips.
          </p>
        </div>

        <div style={categoriesGrid}>
          {categories.map((cat) => (
            <div
              key={cat.name}
              style={categoryCard}
              onClick={() => setTypeFilter(cat.name)}
            >
              <div style={categoryIcon}>{cat.icon}</div>
              <h3 style={categoryName}>{cat.name}</h3>
              <p style={categoryCount}>
                {getCategoryCount(cat.name)} trips available
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={mainGrid}>
        <section style={sectionBox} id="latest-trips">
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Latest Trips</h2>
            <p style={sectionSubtitle}>
              Fresh travel plans from people around you.
            </p>
          </div>

          <div style={tripList}>
            {filteredTrips.length === 0 ? (
              <p style={emptyText}>No trips found</p>
            ) : (
              filteredTrips.map((trip) => {
                const ownerId = trip?.user?._id || trip?.user;
                const isRequesting = requestLoading === trip._id;

                return (
                  <div
                    key={trip._id}
                    style={tripCard}
                    onClick={() => {
                      if (trip?._id) navigate(`/trip/${trip._id}`);
                    }}
                  >
                    <div style={tripTop}>
                      <h3 style={tripTitle}>{trip.destination}</h3>
                      <span style={typeBadge}>
                        {trip.travelType || "Trip"}
                      </span>
                    </div>

                    <p style={description}>
                      {trip.description || "No description added."}
                    </p>

                    <div style={infoGrid}>
                      <div style={infoBox}>
                        <span style={infoLabel}>Budget</span>
                        <b>₹{trip.budget || "Not added"}</b>
                      </div>

                      <div style={infoBox}>
                        <span style={infoLabel}>Start</span>
                        <b>{formatDate(trip.startDate)}</b>
                      </div>

                      <div style={infoBox}>
                        <span style={infoLabel}>By</span>
                        <b>{trip.user?.name || "Unknown"}</b>
                      </div>
                    </div>

                    <div style={dateRow}>
                      <span style={dateBadge}>
                        Created: {formatDate(trip.createdAt)}
                      </span>
                      <span style={dateBadge}>
                        End: {formatDate(trip.endDate)}
                      </span>
                    </div>

                    <div style={buttonRow}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (ownerId) navigate(`/user/${ownerId}`);
                        }}
                        style={whiteBtn}
                        disabled={!ownerId}
                      >
                        View Profile
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRequest(trip);
                        }}
                        style={darkBtn}
                        disabled={!ownerId || isRequesting}
                      >
                        {isRequesting ? "Sending..." : "Send Request"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <aside style={sectionBox}>
          <div style={sectionHeader}>
            <h2 style={sectionTitle}>Explore Places</h2>
            <p style={sectionSubtitle}>
              Tap any place to open AI trip planner.
            </p>
          </div>

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
        </aside>
      </div>

      <section style={statsSection}>
        <div style={statBox}>
          <h2 style={statNumber}>{stats.usersCount || 0}+</h2>
          <p style={statText}>Happy Travelers</p>
        </div>

        <div style={statBox}>
          <h2 style={statNumber}>{stats.tripsCount || 0}+</h2>
          <p style={statText}>Trips Created</p>
        </div>

        <div style={statBox}>
          <h2 style={statNumber}>{stats.requestsCount || 0}+</h2>
          <p style={statText}>Buddy Requests</p>
        </div>

        <div style={statBox}>
          <h2 style={statNumber}>{stats.destinationsCount || 0}+</h2>
          <p style={statText}>Destinations</p>
        </div>
      </section>
    </div>
  );
};

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  padding: "14px 18px",
  background:
    "radial-gradient(circle at 15% 10%, rgba(124,58,237,0.14), transparent 28%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.10), transparent 25%), #050505",
  boxSizing: "border-box",
};

const heroSection = {
  position: "relative",
  minHeight: "260px",
  borderRadius: "26px",
  overflow: "hidden",
  marginBottom: "16px",
  padding: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "18px",
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
    "linear-gradient(90deg, rgba(0,0,0,0.88), rgba(0,0,0,0.48), rgba(0,0,0,0.18))",
};

const heroContent = {
  position: "relative",
  zIndex: 1,
  maxWidth: "760px",
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
  fontSize: "clamp(28px, 4vw, 50px)",
  lineHeight: "1",
  fontWeight: "900",
  color: "#ffffff",
  marginBottom: "10px",
};

const heroText = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#d4d4d4",
  maxWidth: "580px",
};

const heroButtons = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  marginTop: "16px",
};

const primaryHeroBtn = {
  padding: "15px 24px",
  borderRadius: "16px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "15px",
};

const secondaryHeroBtn = {
  padding: "15px 24px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.08)",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "15px",
};

const heroGlassCard = {
  position: "relative",
  zIndex: 1,
  minWidth: "210px",
  padding: "16px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.08)",
  border: "1px solid rgba(255,255,255,0.12)",
  backdropFilter: "blur(10px)",
  color: "#fff",
};

const glassTitle = {
  margin: 0,
  fontSize: "22px",
  fontWeight: "900",
};

const glassText = {
  marginTop: "10px",
  color: "#e5e5e5",
};

const glassPill = {
  display: "inline-block",
  marginTop: "16px",
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#fff",
  color: "#000",
  fontWeight: "900",
  fontSize: "12px",
};

const searchBar = {
  display: "flex",
  gap: "14px",
  marginBottom: "26px",
  flexWrap: "wrap",
  padding: "18px",
  borderRadius: "24px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.1)",
  boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
};

const searchInput = {
  flex: 1,
  minWidth: "240px",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  fontSize: "15px",
  background: "#1a1a1a",
  color: "#ffffff",
};

const searchSelect = {
  minWidth: "190px",
  padding: "15px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.1)",
  outline: "none",
  fontSize: "15px",
  background: "#1a1a1a",
  color: "#ffffff",
};

const clearBtn = {
  padding: "15px 24px",
  borderRadius: "16px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const categoriesSection = {
  padding: "18px",
  borderRadius: "24px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
  marginBottom: "16px",
};

const sectionHeader = {
  marginBottom: "20px",
};

const sectionTitle = {
  fontSize: "24px",
  fontWeight: "900",
  color: "#ffffff",
  margin: 0,
};

const sectionSubtitle = {
  color: "#9ca3af",
  marginTop: "5px",
  lineHeight: "1.5",
  fontSize: "14px",
};

const categoriesGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
  gap: "10px",
};

const categoryCard = {
  padding: "15px",
  borderRadius: "18px",
  background: "#181818",
  border: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
};

const categoryIcon = {
  fontSize: "22px",
  marginBottom: "8px",
};

const categoryName = {
  color: "#ffffff",
  fontSize: "15px",
  fontWeight: "900",
  margin: 0,
};

const categoryCount = {
  color: "#a3a3a3",
  fontSize: "12px",
  marginTop: "4px",
};

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(0, 2fr) minmax(330px, 1fr)",
  gap: "26px",
  width: "100%",
  alignItems: "start",
};

const sectionBox = {
  padding: "18px",
  borderRadius: "24px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 10px 28px rgba(0,0,0,0.35)",
  color: "#ffffff",
  overflow: "hidden",
};

const tripList = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const tripCard = {
  padding: "18px",
  borderRadius: "20px",
  background: "#181818",
  border: "1px solid rgba(255,255,255,0.06)",
  cursor: "pointer",
};

const tripTop = {
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
  flexWrap: "wrap",
};

const tripTitle = {
  fontSize: "clamp(22px, 3vw, 30px)",
  fontWeight: "900",
  color: "#ffffff",
  margin: 0,
};

const typeBadge = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#ffffff",
  color: "#000000",
  fontSize: "12px",
  fontWeight: "900",
  height: "fit-content",
};

const description = {
  color: "#a3a3a3",
  fontSize: "14px",
  lineHeight: "1.6",
  marginTop: "10px",
  marginBottom: "12px",
};

const infoGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
  gap: "10px",
  marginBottom: "14px",
};

const infoBox = {
  padding: "13px",
  borderRadius: "16px",
  background: "#0b0b0b",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
};

const infoLabel = {
  display: "block",
  color: "#737373",
  fontSize: "12px",
  marginBottom: "5px",
  fontWeight: "900",
};

const dateRow = {
  display: "flex",
  gap: "10px",
  margin: "14px 0",
  flexWrap: "wrap",
};

const dateBadge = {
  padding: "7px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.08)",
  color: "#e5e5e5",
  fontSize: "12px",
  fontWeight: "800",
};

const buttonRow = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const whiteBtn = {
  padding: "11px 16px",
  borderRadius: "13px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
};

const darkBtn = {
  padding: "11px 16px",
  borderRadius: "13px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "#0b0b0b",
  color: "#ffffff",
  cursor: "pointer",
  fontWeight: "900",
};

const emptyText = {
  color: "#a3a3a3",
  fontSize: "16px",
};

const placesList = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const placeCard = {
  position: "relative",
  height: "145px",
  borderRadius: "18px",
  overflow: "hidden",
  cursor: "pointer",
  border: "1px solid rgba(255,255,255,0.06)",
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
  padding: "17px",
  background: "linear-gradient(to top, rgba(0,0,0,0.82), transparent)",
  color: "#fff",
};

const placeTitle = {
  fontSize: "21px",
  fontWeight: "900",
  marginBottom: "4px",
};

const placeSummary = {
  fontSize: "14px",
  lineHeight: "1.4",
  color: "#e5e7eb",
};

const statsSection = {
  marginTop: "26px",
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
};

const statBox = {
  padding: "18px",
  borderRadius: "20px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  textAlign: "center",
};

const statNumber = {
  fontSize: "26px",
  fontWeight: "900",
  color: "#ffffff",
  margin: 0,
};

const statText = {
  color: "#9ca3af",
  marginTop: "5px",
  fontWeight: "700",
  fontSize: "13px",
};

export default Home;