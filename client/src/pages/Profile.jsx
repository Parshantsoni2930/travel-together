import { useEffect, useState } from "react";
import {
  getProfile,
  updateProfile,
  getFriends,
} from "../services/userService";
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
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "";

    if (imagePath.startsWith("http")) {
      return imagePath;
    }

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
      console.log(
        "GET FRIENDS ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const data = await getProfile();

      const user = data.user;

      setFormData({
        name: user?.name || "",
        age: user?.age || "",
        gender: user?.gender || "",
        city: user?.city || "",
        bio: user?.bio || "",
        interests: Array.isArray(user?.interests)
          ? user.interests.join(", ")
          : "",
        email: user?.email || "",
      });

      if (user?.profileImage) {
        setPreview(getImageUrl(user.profileImage));
      }

      localStorage.setItem("user", JSON.stringify(user));

      window.dispatchEvent(new Event("userUpdated"));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error loading profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFriends();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdateLoading(true);

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
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        window.dispatchEvent(
          new Event("userUpdated")
        );

        if (data.user.profileImage) {
          setPreview(
            getImageUrl(data.user.profileImage)
          );
        }
      }

      toast.success("Profile updated successfully");

      await fetchProfile();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error updating profile"
      );
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={loadingContainer}>
        <div style={loadingCard}>
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={heroSection}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>
            Identity • Travel • Connections
          </span>

          <h1 style={heroTitle}>My Profile</h1>

          <p style={heroText}>
            Manage your travel identity, interests,
            and buddy connections.
          </p>
        </div>

        <div style={statsGlass}>
          <span style={statsLabel}>
            Travel Buddies
          </span>

          <h2 style={statsValue}>
            {friendsCount}
          </h2>
        </div>
      </div>

      <div style={profileCard}>
        <div style={topSection}>
          <div style={imageBox}>
            {preview ? (
              <img
                src={preview}
                alt={formData?.name || "Profile"}
                style={profileImg}
              />
            ) : (
              <div style={avatarFallback}>
                {formData.name
                  ? formData.name
                      .charAt(0)
                      .toUpperCase()
                  : "U"}
              </div>
            )}
          </div>

          <div style={friendsBox}>
            <h3 style={friendsTitle}>
              Travel Buddies
            </h3>

            {friends.length > 0 ? (
              <div style={friendsList}>
                {friends
                  .slice(0, 8)
                  .map((friend) => (
                    <div
                      key={friend._id}
                      style={friendItem}
                    >
                      {friend.profileImage ? (
                        <img
                          src={getImageUrl(
                            friend.profileImage
                          )}
                          alt={
                            friend?.name ||
                            "Friend"
                          }
                          style={friendImg}
                        />
                      ) : (
                        <div
                          style={
                            friendFallback
                          }
                        >
                          {friend.name
                            ? friend.name
                                .charAt(0)
                                .toUpperCase()
                            : "U"}
                        </div>
                      )}

                      <span style={friendName}>
                        {friend.name ||
                          "User"}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p style={noFriendsText}>
                No buddies yet. Send requests
                from trips and start
                connecting.
              </p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          style={formStyle}
        >
          <div style={fileBox}>
            <label style={fileLabel}>
              Profile Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={fileInput}
            />
          </div>

          <div style={formGrid}>
            <div>
              <label style={labelStyle}>
                Name
              </label>

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
              <label style={labelStyle}>
                Email
              </label>

              <input
                style={disabledInput}
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div>
              <label style={labelStyle}>
                Age
              </label>

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
              <label style={labelStyle}>
                Gender
              </label>

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
              <label style={labelStyle}>
                City
              </label>

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
              <label style={labelStyle}>
                Interests
              </label>

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
            <label style={labelStyle}>
              Bio
            </label>

            <textarea
              style={textareaStyle}
              name="bio"
              placeholder="Tell other travelers about yourself"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            style={submitBtn}
            disabled={updateLoading}
          >
            {updateLoading
              ? "Updating..."
              : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

const loadingContainer = {
  width: "100%",
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#050505",
};

const loadingCard = {
  padding: "24px 30px",
  borderRadius: "20px",
  background: "#111111",
  color: "#ffffff",
  fontWeight: "900",
  border: "1px solid rgba(255,255,255,0.08)",
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
  position: "relative",
  width: "100%",
  maxWidth: "1400px",
  minHeight: "280px",
  margin: "0 auto 16px",
  padding: "28px",
  borderRadius: "30px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "18px",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  boxShadow:
    "0 14px 36px rgba(0,0,0,0.45)",
  border:
    "1px solid rgba(255,255,255,0.08)",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.82), rgba(0,0,0,0.52), rgba(0,0,0,0.22))",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  maxWidth: "760px",
};

const heroBadge = {
  display: "inline-block",
  padding: "8px 13px",
  borderRadius: "999px",
  background:
    "rgba(255,255,255,0.12)",
  border:
    "1px solid rgba(255,255,255,0.18)",
  color: "#fff",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "14px",
};

const heroTitle = {
  margin: 0,
  fontSize: "clamp(38px, 6vw, 70px)",
  fontWeight: "900",
  lineHeight: "1",
  color: "#ffffff",
};

const heroText = {
  marginTop: "12px",
  color: "#d4d4d4",
  lineHeight: "1.7",
  fontSize: "15px",
  maxWidth: "650px",
};

const statsGlass = {
  position: "relative",
  zIndex: 2,
  padding: "20px 24px",
  borderRadius: "24px",
  background:
    "rgba(255,255,255,0.08)",
  border:
    "1px solid rgba(255,255,255,0.14)",
  backdropFilter: "blur(12px)",
  color: "#ffffff",
  minWidth: "180px",
};

const statsLabel = {
  display: "block",
  fontSize: "13px",
  color: "#d4d4d4",
  marginBottom: "6px",
  fontWeight: "800",
};

const statsValue = {
  margin: 0,
  fontSize: "38px",
  fontWeight: "900",
};

const profileCard = {
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
  padding: "24px",
  borderRadius: "28px",
  background: "#111111",
  border:
    "1px solid rgba(255,255,255,0.08)",
  boxShadow:
    "0 12px 30px rgba(0,0,0,0.35)",
  boxSizing: "border-box",
};

const topSection = {
  display: "flex",
  alignItems: "center",
  gap: "28px",
  marginBottom: "26px",
  padding: "22px",
  borderRadius: "24px",
  background: "#181818",
  border:
    "1px solid rgba(255,255,255,0.06)",
  flexWrap: "wrap",
};

const imageBox = {
  display: "flex",
  justifyContent: "center",
  flexShrink: 0,
};

const profileImg = {
  width: "170px",
  height: "170px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #ffffff",
};

const avatarFallback = {
  width: "170px",
  height: "170px",
  borderRadius: "50%",
  background: "#ffffff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#000000",
  fontSize: "62px",
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
  color: "#ffffff",
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
  border: "3px solid #ffffff",
  margin: "0 auto",
};

const friendFallback = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  background: "#ffffff",
  color: "#000000",
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
  color: "#d4d4d4",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const noFriendsText = {
  fontSize: "15px",
  color: "#9ca3af",
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
  color: "#ffffff",
};

const fileInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "14px",
  border:
    "1px dashed rgba(255,255,255,0.12)",
  background: "#181818",
  color: "#ffffff",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "14px",
};

const labelStyle = {
  display: "block",
  marginBottom: "8px",
  fontWeight: "900",
  color: "#ffffff",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginBottom: "14px",
  borderRadius: "14px",
  border:
    "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  fontSize: "14px",
  background: "#1a1a1a",
  color: "#ffffff",
};

const disabledInput = {
  ...inputStyle,
  background: "#0b0b0b",
  color: "#9ca3af",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: "120px",
  resize: "vertical",
};

const submitBtn = {
  width: "100%",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  fontWeight: "900",
  fontSize: "15px",
  cursor: "pointer",
  marginTop: "8px",
};

export default Profile;