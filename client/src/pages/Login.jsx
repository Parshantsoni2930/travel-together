import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("userUpdated"));
      }

      toast.success("Welcome back!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div style={pageStyle}>
      <div style={heroPanel}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>Travel • Connect • Explore</span>

          <h1 style={heroTitle}>Welcome Back</h1>

          <p style={heroText}>
            Login and continue finding your perfect travel buddies.
          </p>
        </div>
      </div>

      <div style={authCard}>
        <div style={logoCircle}>🌍</div>

        <h2 style={titleStyle}>Login</h2>

        <p style={subtitleStyle}>
          Enter your details to continue your journey.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Email</label>

          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>Password</label>

          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" style={submitBtn}>
            Login
          </button>
        </form>

        <p style={bottomText}>
          Don’t have an account?{" "}
          <button onClick={() => navigate("/")} style={linkBtn}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

const pageStyle = {
  width: "100%",
  minHeight: "100vh",
  display: "grid",
  gridTemplateColumns: "1.2fr 0.8fr",
  alignItems: "center",
  gap: "24px",
  padding: "24px",
  background:
    "radial-gradient(circle at 15% 10%, rgba(124,58,237,0.14), transparent 28%), radial-gradient(circle at 90% 20%, rgba(236,72,153,0.10), transparent 25%), #050505",
  boxSizing: "border-box",
};

const heroPanel = {
  position: "relative",
  minHeight: "calc(100vh - 48px)",
  borderRadius: "34px",
  overflow: "hidden",
  backgroundImage:
    "url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
};

const heroOverlay = {
  position: "absolute",
  inset: 0,
  background:
    "linear-gradient(90deg, rgba(0,0,0,0.86), rgba(0,0,0,0.48), rgba(0,0,0,0.16))",
};

const heroContent = {
  position: "relative",
  zIndex: 2,
  padding: "42px",
  height: "100%",
  minHeight: "calc(100vh - 48px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
};

const heroBadge = {
  display: "inline-block",
  width: "fit-content",
  padding: "8px 13px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.12)",
  border: "1px solid rgba(255,255,255,0.18)",
  color: "#ffffff",
  fontSize: "12px",
  fontWeight: "900",
  marginBottom: "14px",
};

const heroTitle = {
  margin: 0,
  fontSize: "clamp(44px, 7vw, 84px)",
  fontWeight: "900",
  lineHeight: "1",
  color: "#ffffff",
};

const heroText = {
  marginTop: "16px",
  color: "#d4d4d4",
  fontSize: "16px",
  lineHeight: "1.7",
  maxWidth: "620px",
};

const authCard = {
  width: "100%",
  maxWidth: "430px",
  justifySelf: "center",
  padding: "28px",
  borderRadius: "28px",
  background: "#111111",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 36px rgba(0,0,0,0.45)",
  textAlign: "center",
};

const logoCircle = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  margin: "0 auto 16px",
  background: "#ffffff",
  color: "#000000",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  boxShadow: "0 10px 24px rgba(255,255,255,0.12)",
};

const titleStyle = {
  margin: 0,
  fontSize: "32px",
  fontWeight: "900",
  color: "#ffffff",
};

const subtitleStyle = {
  margin: "8px 0 22px",
  color: "#9ca3af",
  fontSize: "14px",
  lineHeight: "1.6",
};

const labelStyle = {
  display: "block",
  textAlign: "left",
  marginBottom: "7px",
  fontWeight: "900",
  color: "#ffffff",
  fontSize: "14px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px",
  marginBottom: "15px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  outline: "none",
  background: "#1a1a1a",
  color: "#ffffff",
  fontSize: "14px",
};

const submitBtn = {
  width: "100%",
  padding: "15px",
  borderRadius: "16px",
  border: "none",
  background: "#ffffff",
  color: "#000000",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "15px",
  marginTop: "4px",
};

const bottomText = {
  marginTop: "18px",
  color: "#9ca3af",
};

const linkBtn = {
  border: "none",
  background: "transparent",
  color: "#ffffff",
  fontWeight: "900",
  cursor: "pointer",
};

export default Login;