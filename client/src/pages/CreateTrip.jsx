import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTrip } from "../services/tripService";
import toast from "react-hot-toast";

const CreateTrip = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
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

      await createTrip({
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
        "Trip created successfully!"
      );

      navigate("/my-trips");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Error creating trip"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <span style={heroBadge}>
          Create • Share • Connect
        </span>

        <h1 style={heroTitle}>
          Plan Your Next Adventure
        </h1>

        <p style={heroText}>
          Share your travel plan,
          discover companions, and
          connect with people going
          to the same destination.
        </p>
      </div>

      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Create Trip
          </h2>

          <p style={subtitleStyle}>
            Add your destination,
            budget, dates, and
            travel vibe.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          <div style={formGrid}>
            <div style={fullWidth}>
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
            </div>

            <div>
              <label style={labelStyle}>
                Start Date
              </label>

              <input
                style={inputStyle}
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

            <div>
              <label style={labelStyle}>
                End Date
              </label>

              <input
                style={inputStyle}
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

            <div>
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
            </div>

            <div>
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
            </div>

            <div style={fullWidth}>
              <label style={labelStyle}>
                Description
              </label>

              <textarea
                style={textareaStyle}
                name="description"
                placeholder="Tell people about your travel plans, vibe, budget, expectations..."
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                required
              />
            </div>
          </div>

          <button
            type="submit"
            style={submitBtn}
            disabled={loading}
          >
            {loading
              ? "Creating Trip..."
              : "Create Trip"}
          </button>
        </form>
      </div>
    </div>
  );
};

/* KEEP YOUR EXISTING STYLES SAME */

export default CreateTrip;