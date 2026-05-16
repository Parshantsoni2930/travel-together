import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getPublicProfile,
  sendFriendRequest,
  acceptFriendRequest,
} from "../services/userService";
import { getAllTrips } from "../services/tripService";
import toast from "react-hot-toast";

const PublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [userTrips, setUserTrips] = useState([]);
  const [friendStatus, setFriendStatus] = useState("none");

  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const isOwnProfile = loggedInUser?._id === id;

  const getImageUrl = (img) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await getPublicProfile(id);
        setUser(profileData.user);
        setFriendStatus(profileData.friendStatus || "none");

        const tripsData = await getAllTrips();
        const filteredTrips = (tripsData.trips || []).filter(
          (trip) => trip.user?._id === id || trip.user === id
        );

        setUserTrips(filteredTrips);
      } catch (error) {
        toast.error("Error loading profile");
      }
    };

    fetchData();
  }, [id]);

  const handleAddBuddy = async () => {
    try {
      await sendFriendRequest(id);
      toast.success("Request sent!");
      setFriendStatus("sent");
    } catch (error) {
      const msg = error.response?.data?.message || "";

      if (msg.includes("already")) {
        setFriendStatus("sent");
        return;
      }

      if (msg.includes("friend")) {
        setFriendStatus("friends");
        return;
      }

      toast.error("Error");
    }
  };

  const handleAccept = async () => {
    try {
      await acceptFriendRequest(id);
      toast.success("Friend added!");
      setFriendStatus("friends");
    } catch {
      toast.error("Error");
    }
  };

  if (!user) return <div>Loading...</div>;

  const profileImg = getImageUrl(user.profileImage);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>← Back</button>

      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div>
          {profileImg ? (
            <img src={profileImg} width="100" />
          ) : (
            <div>{user.name?.[0]}</div>
          )}
        </div>

        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <p>{user.friends?.length || 0} Friends</p>

          {!isOwnProfile && (
            <>
              {friendStatus === "none" && (
                <button onClick={handleAddBuddy}>Add Buddy</button>
              )}

              {friendStatus === "sent" && (
                <button disabled>Request Sent ✓</button>
              )}

              {friendStatus === "received" && (
                <button onClick={handleAccept}>Accept Request</button>
              )}

              {friendStatus === "friends" && (
                <button disabled>Friends ✓</button>
              )}
            </>
          )}

          {isOwnProfile && (
            <button onClick={() => navigate("/profile")}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <h3>Trips</h3>

      {userTrips.map((trip) => (
        <div key={trip._id}>
          <h4>{trip.destination}</h4>
          <p>{trip.description}</p>
        </div>
      ))}
    </div>
  );
};

export default PublicProfile;