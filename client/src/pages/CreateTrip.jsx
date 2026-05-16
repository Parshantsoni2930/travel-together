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

      toast.success("Trip created!");

      navigate("/my-trips"); // 👈 better UX
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>Create Trip ✈️</h2>
          <p style={subtitleStyle}>
            Add your travel plan and find a buddy for your journey.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
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

            <div style={{ flex: 1 }}>
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
          </div>

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

          <label style={labelStyle}>Description</label>
          <textarea
            style={{ ...inputStyle, minHeight: "110px", resize: "vertical" }}
            name="description"
            placeholder="Tell people about your trip plan..."
            value={formData.description}
            onChange={handleChange}
            required
          />

          <button type="submit" style={submitBtn} disabled={loading}>
            {loading ? "Creating..." : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  padding: "28px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const cardStyle = {
  maxWidth: "680px",
  margin: "0 auto",
  padding: "26px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const headerStyle = {
  marginBottom: "20px",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "900",
  color: "#111827",
};

const subtitleStyle = {
  margin: "8px 0 0",
  color: "#64748b",
};

const rowStyle = {
  display: "flex",
  gap: "14px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "800",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "16px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  outline: "none",
  background: "#ffffff",
  color: "#111827",
};

const submitBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "16px",
  boxShadow: "0 8px 18px rgba(236,72,153,0.28)",
};

export default CreateTrip;