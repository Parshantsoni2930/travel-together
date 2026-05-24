import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../services/tripService";
import toast from "react-hot-toast";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelType: "",
    description: "",
  });

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
      const {
        destination,
        startDate,
        endDate,
        budget,
        travelType,
        description,
      } = formData;

      if (!destination || !startDate || !endDate || !budget || !travelType) {
        return toast.error("Please fill all required fields");
      }

      if (new Date(endDate) < new Date(startDate)) {
        return toast.error("End date cannot be before start date");
      }

      setLoading(true);

      await createTrip({
        destination: destination.trim(),
        startDate,
        endDate,
        budget,
        travelType,
        description: description.trim(),
      });

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
        <span style={heroBadge}>Create • Share • Connect</span>

        <h1 style={heroTitle}>Plan Your Next Adventure</h1>

        <p style={heroText}>
          Share your travel plan, discover companions, and connect with people
          going to the same destination.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Create Trip</h2>

          <p style={subtitleStyle}>
            Add your destination, budget, dates, and travel vibe.
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
                type="number"
                name="budget"
                placeholder="e.g. 5000"
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
  color: "#ffffff",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxSizing: "border-box",
};

const heroBadge = {
  display: "inline-block",
  padding: "8px 13px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#ffffff",
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

const cardStyle = {
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
  marginBottom: "18px",
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

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const fullWidth = {
  gridColumn: "1 / -1",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "800",
  color: "#ffffff",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  background: "#1a1a1a",
  color: "#ffffff",
  fontSize: "14px",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical",
};

const submitBtn = {
  width: "100%",
  marginTop: "18px",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "15px",
};

export default CreateTrip;