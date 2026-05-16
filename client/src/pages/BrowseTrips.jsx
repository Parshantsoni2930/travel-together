import { useEffect, useState } from "react";
import { getAllTrips } from "../services/tripService";
import { sendRequest } from "../services/requestService";
import toast from "react-hot-toast";

const BrowseTrips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips();
        setTrips(data.trips);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading trips");
      }
    };

    fetchTrips();
  }, []);

  const handleRequest = async (trip) => {
    try {
      await sendRequest({
        receiverId: trip.user._id,
        tripId: trip._id,
      });

      toast.success("Request sent!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Browse Trips</h2>

      {trips.map((trip) => (
        <div key={trip._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{trip.destination}</h3>
          <p>Budget: {trip.budget}</p>
          <p>Type: {trip.travelType}</p>
          <p>{trip.description}</p>

          <button onClick={() => handleRequest(trip)}>
            Send Request
          </button>
          <button onClick={() => navigate(`/user/${trip.user._id}`)}>
            View Profile
          </button>
        </div>
      ))}
    </div>
  );
};

export default BrowseTrips;