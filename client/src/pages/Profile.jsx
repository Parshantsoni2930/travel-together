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
    return `https://travel-together-z3dr.onrender.com${
      imagePath.startsWith("/") ? imagePath : `/${imagePath}`
    }`;
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
        <div style={headerSection}>
          <div>
            <h1 style={titleStyle}>My Profile</h1>
            <p style={subtitleStyle}>
              Manage your travel identity, interests, and buddy connections.
            </p>
          </div>

          <div style={statsPill}>
            <span style={statsNumber}>{friendsCount}</span>
            <span style={statsText}>Friends</span>
          </div>
        </div>

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
            <h3 style={friendsTitle}>Travel Buddies</h3>

            {friends.length > 0 ? (
              <div style={friendsList}>
                {friends.slice(0, 8).map((friend) => (
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

                    <span style={friendName}>{friend.name || "User"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={noFriendsText}>
                No buddies yet. Send requests from trips and start connecting.
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={fileBox}>
            <label style={fileLabel}>Profile Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={fileInput}
            />
          </div>

          <div style={formGrid}>
            <div>
              <label style={labelStyle}>Name</label>
              <input
                style={inputStyle}
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Email</label>
              <input
                style={{ ...inputStyle, background: "#e5e7eb" }}
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div>
              <label style={labelStyle}>Age</label>
              <input
                style={inputStyle}
                type="text"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Gender</label>
              <input
                style={inputStyle}
                type="text"
                name="gender"
                placeholder="Gender"
                value={formData.gender}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>City</label>
              <input
                style={inputStyle}
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={labelStyle}>Interests</label>
              <input
                style={inputStyle}
                type="text"
                name="interests"
                placeholder="Trekking, beaches, road trips"
                value={formData.interests}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Bio</label>
            <textarea
              style={textareaStyle}
              name="bio"
              placeholder="Tell other travelers about yourself"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button type="submit" style={submitBtn}>
            Update Profile
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

const profileCard = {
  width: "100%",
  maxWidth: "1150px",
  margin: "0 auto",
  padding: "34px",
  borderRadius: "30px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 18px 45px rgba(0,0,0,0.38)",
  boxSizing: "border-box",
  color: "#111827",
};

const headerSection = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "20px",
  marginBottom: "28px",
  flexWrap: "wrap",
};

const titleStyle = {
  margin: 0,
  fontSize: "38px",
  fontWeight: "900",
  color: "#111827",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "16px",
  lineHeight: "1.6",
};

const statsPill = {
  padding: "14px 22px",
  borderRadius: "999px",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  boxShadow: "0 10px 22px rgba(79,70,229,0.35)",
};

const statsNumber = {
  fontSize: "24px",
  fontWeight: "900",
};

const statsText = {
  fontSize: "14px",
  fontWeight: "800",
};

const topSection = {
  display: "flex",
  alignItems: "center",
  gap: "32px",
  marginBottom: "30px",
  padding: "26px",
  borderRadius: "26px",
  background: "#ffffff",
  boxShadow: "0 10px 26px rgba(15,23,42,0.12)",
  flexWrap: "wrap",
};

const imageBox = {
  display: "flex",
  justifyContent: "center",
  flexShrink: 0,
};

const profileImg = {
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "5px solid #4f46e5",
};

const avatarFallback = {
  width: "180px",
  height: "180px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#fff",
  fontSize: "68px",
  fontWeight: "900",
};

const friendsBox = {
  flex: 1,
  minWidth: "260px",
};

const friendsTitle = {
  margin: "0 0 16px",
  fontSize: "24px",
  fontWeight: "900",
  color: "#111827",
};

const friendsList = {
  display: "flex",
  gap: "16px",
  flexWrap: "wrap",
};

const friendItem = {
  width: "86px",
  textAlign: "center",
};

const friendImg = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #4f46e5",
  margin: "0 auto",
};

const friendFallback = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #6366f1, #ec4899)",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "900",
  margin: "0 auto",
  fontSize: "22px",
};

const friendName = {
  display: "block",
  marginTop: "8px",
  fontSize: "12px",
  fontWeight: "800",
  color: "#374151",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const noFriendsText = {
  fontSize: "15px",
  color: "#6b7280",
  lineHeight: "1.6",
};

const formStyle = {
  width: "100%",
};

const fileBox = {
  marginBottom: "20px",
};

const fileLabel = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "900",
  color: "#334155",
};

const fileInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "14px",
  border: "1px dashed #94a3b8",
  background: "#ffffff",
  color: "#334155",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "16px",
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
  marginBottom: "16px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  outline: "none",
  fontSize: "15px",
  background: "#fff",
  color: "#111827",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical",
};

const submitBtn = {
  width: "100%",
  padding: "16px",
  borderRadius: "18px",
  border: "none",
  background: "linear-gradient(135deg, #4f46e5, #ec4899)",
  color: "#fff",
  fontWeight: "900",
  fontSize: "17px",
  cursor: "pointer",
  marginTop: "8px",
  boxShadow: "0 10px 24px rgba(79,70,229,0.32)",
};

export default Profile;