import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../services/tripService";
import toast from "react-hot-toast";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelType: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      await createTrip(formData);

      toast.success("Trip created successfully!");

      navigate("/my-trips");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <h1 style={heroTitle}>Plan Your Next Adventure ✈️</h1>

        <p style={heroText}>
          Share your travel plans, discover companions, and make unforgettable
          memories with travel buddies.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Create Trip</h2>

          <p style={subtitleStyle}>
            Fill in your trip details and connect with people traveling to the
            same destination.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={formGrid}>
            <div style={fullWidth}>
              <label style={labelStyle}>Destination</label>

              <input
                style={inputStyle}
                type="text"
                name="destination"
                placeholder="e.g. Goa, Manali, Jaipur"
                value={formData.destination}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Start Date</label>

              <input
                style={inputStyle}
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>End Date</label>

              <input
                style={inputStyle}
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Budget</label>

              <input
                style={inputStyle}
                type="text"
                name="budget"
                placeholder="e.g. 5000 or 5k"
                value={formData.budget}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Travel Type</label>

              <select
                style={inputStyle}
                name="travelType"
                value={formData.travelType}
                onChange={handleChange}
                required
              >
                <option value="">Select travel type</option>
                <option value="Adventure">Adventure</option>
                <option value="Beach">Beach</option>
                <option value="Mountains">Mountains</option>
                <option value="Temple">Temple</option>
                <option value="Trekking">Trekking</option>
                <option value="City">City</option>
                <option value="Road Trip">Road Trip</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={fullWidth}>
              <label style={labelStyle}>Description</label>

              <textarea
                style={textareaStyle}
                name="description"
                placeholder="Tell people about your travel plans, vibe, budget, expectations..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" style={submitBtn} disabled={loading}>
            {loading ? "Creating Trip..." : "Create Trip"}
          </button>
        </form>
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

const heroSection = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto 28px",
  padding: "36px",
  borderRadius: "30px",
  background:
    "linear-gradient(135deg, rgba(79,70,229,0.92), rgba(236,72,153,0.85), rgba(249,115,22,0.82))",
  color: "#fff",
  boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
};

const heroTitle = {
  margin: 0,
  fontSize: "44px",
  fontWeight: "900",
  lineHeight: "1.1",
};

const heroText = {
  marginTop: "14px",
  fontSize: "17px",
  lineHeight: "1.7",
  color: "#f8fafc",
  maxWidth: "760px",
};

const cardStyle = {
  width: "100%",
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "34px",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
  boxSizing: "border-box",
};

const headerStyle = {
  marginBottom: "28px",
};

const titleStyle = {
  margin: 0,
  fontSize: "34px",
  fontWeight: "900",
  color: "#111827",
};

const subtitleStyle = {
  marginTop: "10px",
  color: "#64748b",
  fontSize: "16px",
  lineHeight: "1.6",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "18px",
};

const fullWidth = {
  gridColumn: "1 / -1",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "900",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "15px",
  borderRadius: "15px",
  border: "1px solid #cbd5e1",
  outline: "none",
  background: "#ffffff",
  color: "#111827",
  fontSize: "15px",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "140px",
  resize: "vertical",
};

const submitBtn = {
  width: "100%",
  marginTop: "26px",
  padding: "16px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "17px",
  boxShadow: "0 10px 24px rgba(236,72,153,0.32)",
};

export default CreateTrip;