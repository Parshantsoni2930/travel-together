import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../services/userService";
import toast from "react-hot-toast";
const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setUser(data.user);
      } catch (error) {
        toast.error(error.response?.data?.message || "Error loading profile");
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>

      {user ? (
        <div>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>

           <button onClick={() => navigate("/create-trip")}>Create Trip</button>
           
           <button onClick={() => navigate("/my-trips")} style={{ marginLeft: "10px" }}>
            My Trips
           </button>
           
           <button onClick={() => navigate("/requests")} style={{ marginLeft: "10px" }}>
            Requests
           </button>
           
           <button onClick={() => navigate("/chats")} style={{ marginLeft: "10px" }}>
            Chats
           </button>
           
           <button onClick={() => navigate("/profile")} style={{ marginLeft: "10px" }}>
            Profile
           </button>
          
           <button onClick={handleLogout} style={{ marginLeft: "10px" }}>
            Logout
           </button>







        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;