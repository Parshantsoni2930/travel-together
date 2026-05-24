import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getTripById,
  updateTrip,
} from "../services/tripService";

import toast from "react-hot-toast";

const EditTrip = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [formData, setFormData] =
    useState({
      destination: "",
      startDate: "",
      endDate: "",
      budget: "",
      travelType: "",
      description: "",
    });

  const fetchTrip = async () => {
    try {
      setFetching(true);

      const data =
        await getTripById(id);

      const trip = data.trip;

      if (!trip) {
        toast.error(
          "Trip not found"
        );

        return navigate(
          "/my-trips"
        );
      }

      setFormData({
        destination:
          trip.destination ||
          "",

        startDate:
          trip.startDate
            ? trip.startDate.slice(
                0,
                10
              )
            : "",

        endDate:
          trip.endDate
            ? trip.endDate.slice(
                0,
                10
              )
            : "",

        budget:
          trip.budget || "",

        travelType:
          trip.travelType ||
          "",

        description:
          trip.description ||
          "",
      });
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error loading trip"
      );

      navigate("/my-trips");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
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

      if (
        !destination ||
        !startDate ||
        !endDate ||
        !budget ||
        !travelType
      ) {
        return toast.error(
          "Please fill all required fields"
        );
      }

      if (
        new Date(endDate) <
        new Date(startDate)
      ) {
        return toast.error(
          "End date cannot be before start date"
        );
      }

      setLoading(true);

      await updateTrip(id, {
        destination:
          destination.trim(),

        startDate,
        endDate,

        budget,

        travelType,

        description:
          description.trim(),
      });

      toast.success(
        "Trip updated!"
      );

      navigate("/my-trips");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error updating trip"
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={loadingPage}>
        <h2 style={loadingText}>
          Loading trip...
        </h2>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <button
            onClick={() =>
              navigate(
                "/my-trips"
              )
            }
            style={backBtn}
          >
            ← Back
          </button>

          <h2 style={titleStyle}>
            Edit Trip ✏️
          </h2>

          <p style={subtitleStyle}>
            Update your travel
            details and keep your
            buddy plan fresh.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          <label style={labelStyle}>
            Destination
          </label>

          <input
            style={inputStyle}
            type="text"
            name="destination"
            placeholder="e.g. Goa, Manali, Jaipur"
            value={
              formData.destination
            }
            onChange={
              handleChange
            }
            required
          />

          <div style={rowStyle}>
            <div style={{ flex: 1 }}>
              <label
                style={
                  labelStyle
                }
              >
                Start Date
              </label>

              <input
                style={
                  inputStyle
                }
                type="date"
                name="startDate"
                value={
                  formData.startDate
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={
                  labelStyle
                }
              >
                End Date
              </label>

              <input
                style={
                  inputStyle
                }
                type="date"
                name="endDate"
                value={
                  formData.endDate
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>
          </div>

          <label style={labelStyle}>
            Budget
          </label>

          <input
            style={inputStyle}
            type="number"
            name="budget"
            placeholder="e.g. 5000"
            value={
              formData.budget
            }
            onChange={
              handleChange
            }
            required
          />

          <label style={labelStyle}>
            Travel Type
          </label>

          <select
            style={inputStyle}
            name="travelType"
            value={
              formData.travelType
            }
            onChange={
              handleChange
            }
            required
          >
            <option value="">
              Select travel type
            </option>

            <option value="Adventure">
              Adventure
            </option>

            <option value="Beach">
              Beach
            </option>

            <option value="Mountains">
              Mountains
            </option>

            <option value="Temple">
              Temple
            </option>

            <option value="Trekking">
              Trekking
            </option>

            <option value="City">
              City
            </option>

            <option value="Road Trip">
              Road Trip
            </option>

            <option value="Other">
              Other
            </option>
          </select>

          <label style={labelStyle}>
            Description
          </label>

          <textarea
            style={{
              ...inputStyle,
              minHeight:
                "110px",
              resize: "vertical",
            }}
            name="description"
            placeholder="Tell people about your updated trip plan..."
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            required
          />

          <button
            type="submit"
            style={submitBtn}
            disabled={loading}
          >
            {loading
              ? "Updating..."
              : "Update Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

const loadingPage = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "#020617",
};

const loadingText = {
  color: "#ffffff",
};

const pageStyle = {
  minHeight: "100vh",
  padding: "28px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const cardStyle = {
  width: "100%",
  maxWidth: "900px",
  margin: "0 auto",
  padding: "28px",
  borderRadius: "28px",
  background: "#111111",
  border:
    "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 14px 36px rgba(0,0,0,0.45)",
};

const headerStyle = {
  marginBottom: "24px",
};

const backBtn = {
  padding: "10px 18px",
  borderRadius: "999px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
  marginBottom: "18px",
};

const titleStyle = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "900",
  color: "#ffffff",
};

const subtitleStyle = {
  marginTop: "10px",
  color: "#9ca3af",
  lineHeight: "1.6",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  marginTop: "16px",
  color: "#ffffff",
  fontWeight: "800",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  borderRadius: "14px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  background: "#1a1a1a",
  color: "#ffffff",
  fontSize: "14px",
};

const rowStyle = {
  display: "flex",
  gap: "14px",
  marginTop: "6px",
};

const submitBtn = {
  width: "100%",
  marginTop: "22px",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "15px",
};

export default EditTrip;