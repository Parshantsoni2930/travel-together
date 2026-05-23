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

/* KEEP YOUR EXISTING STYLES SAME */

export default MyTrips;