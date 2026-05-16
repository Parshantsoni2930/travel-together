import { useEffect, useState } from "react";
import { getProfile, updateProfile, getFriends } from "../services/userService";
import toast from "react-hot-toast";

const Profile = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    city: "",
    bio: "",
    interests: "",
    email: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http")) return imagePath;
    return `https://travel-together-z3dr.onrender.com${imagePath}`;
  };

  const fetchFriends = async () => {
    try {
      const data = await getFriends();
      setFriends(data.friends || []);
      setFriendsCount(data.friends?.length || 0);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      const user = data.user;

      setFormData({
        name: user.name || "",
        age: user.age || "",
        gender: user.gender || "",
        city: user.city || "",
        bio: user.bio || "",
        interests: Array.isArray(user.interests)
          ? user.interests.join(", ")
          : "",
        email: user.email || "",
      });

      if (user.profileImage) {
        setPreview(getImageUrl(user.profileImage));
      }

      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error loading profile");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFriends();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("age", formData.age);
      payload.append("gender", formData.gender);
      payload.append("city", formData.city);
      payload.append("bio", formData.bio);
      payload.append("interests", formData.interests);

      if (profileImage) {
        payload.append("profileImage", profileImage);
      }

      const data = await updateProfile(payload);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userUpdated"));

        if (data.user.profileImage) {
          setPreview(getImageUrl(data.user.profileImage));
        }
      }

      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={profileCard}>
        <h2 style={titleStyle}>My Profile</h2>

        <div style={topSection}>
          <div style={imageBox}>
            {preview ? (
              <img src={preview} alt="Profile" style={profileImg} />
            ) : (
              <div style={avatarFallback}>
                {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}
          </div>

          <div style={friendsBox}>
            <h3 style={friendsTitle}>Friends ({friendsCount})</h3>

            {friends.length > 0 ? (
              <div style={friendsList}>
                {friends.slice(0, 6).map((friend) => (
                  <div key={friend._id} style={friendItem}>
                    {friend.profileImage ? (
                      <img
                        src={getImageUrl(friend.profileImage)}
                        alt={friend.name}
                        style={friendImg}
                      />
                    ) : (
                      <div style={friendFallback}>
                        {friend.name ? friend.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}

                    <span style={friendName}>
                      {friend.name || "User"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={noFriendsText}>No friends yet</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={fileInput}
          />

          <input
            style={inputStyle}
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />

          <input
            style={{ ...inputStyle, background: "#e5e7eb" }}
            type="email"
            name="email"
            value={formData.email}
            disabled
          />

          <input
            style={inputStyle}
            type="text"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
          />

          <input
            style={inputStyle}
            type="text"
            name="gender"
            placeholder="Gender"
            value={formData.gender}
            onChange={handleChange}
          />

          <input
            style={inputStyle}
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />

          <textarea
            style={{ ...inputStyle, minHeight: "90px", resize: "vertical" }}
            name="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />

          <input
            style={inputStyle}
            type="text"
            name="interests"
            placeholder="Interests"
            value={formData.interests}
            onChange={handleChange}
          />

          <button type="submit" style={submitBtn}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  padding: "30px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const profileCard = {
  maxWidth: "720px",
  margin: "auto",
  padding: "26px",
  borderRadius: "22px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
};

const titleStyle = {
  marginTop: 0,
  marginBottom: "22px",
};

const topSection = {
  display: "flex",
  alignItems: "center",
  gap: "24px",
  marginBottom: "20px",
  padding: "18px",
  borderRadius: "18px",
  background: "#ffffff",
  boxShadow: "0 6px 18px rgba(15,23,42,0.12)",
};

const imageBox = {
  display: "flex",
  justifyContent: "center",
  flexShrink: 0,
};

const profileImg = {
  width: "135px",
  height: "135px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #4f46e5",
};

const avatarFallback = {
  width: "135px",
  height: "135px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "50px",
  fontWeight: "900",
};

const friendsBox = {
  flex: 1,
};

const friendsTitle = {
  margin: "0 0 12px",
  fontSize: "18px",
  color: "#111827",
};

const friendsList = {
  display: "flex",
  gap: "12px",
  flexWrap: "wrap",
};

const friendItem = {
  width: "70px",
  textAlign: "center",
};

const friendImg = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid #4f46e5",
};

const friendFallback = {
  width: "48px",
  height: "48px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1, #ec4899)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  margin: "auto",
};

const friendName = {
  display: "block",
  marginTop: "5px",
  fontSize: "11px",
  fontWeight: "700",
  color: "#374151",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const noFriendsText = {
  fontSize: "14px",
  color: "#6b7280",
};

const fileInput = {
  marginBottom: "14px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px",
  marginBottom: "12px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const submitBtn = {
  width: "100%",
  padding: "12px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
  fontWeight: "800",
  cursor: "pointer",
};

export default Profile;