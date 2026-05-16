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
      <div style={authCard}>
        <div style={logoCircle}>🌍</div>

        <h2 style={titleStyle}>Welcome Back</h2>
        <p style={subtitleStyle}>
          Login and continue finding your travel buddies.
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
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  background:
    "radial-gradient(circle at top left, #312e81, transparent 35%), radial-gradient(circle at top right, #831843, transparent 30%), linear-gradient(135deg, #020617, #111827)",
};

const authCard = {
  width: "100%",
  maxWidth: "430px",
  padding: "28px",
  borderRadius: "24px",
  background: "linear-gradient(135deg, #f8fafc, #eef2ff)",
  boxShadow: "0 12px 35px rgba(0,0,0,0.4)",
  textAlign: "center",
};

const logoCircle = {
  width: "62px",
  height: "62px",
  borderRadius: "50%",
  margin: "0 auto 16px",
  background: "linear-gradient(135deg, #4f46e5, #ec4899, #f97316)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "30px",
  boxShadow: "0 8px 20px rgba(236,72,153,0.35)",
};

const titleStyle = {
  margin: 0,
  fontSize: "30px",
  fontWeight: "900",
  color: "#111827",
};

const subtitleStyle = {
  margin: "8px 0 22px",
  color: "#64748b",
};

const labelStyle = {
  display: "block",
  textAlign: "left",
  marginBottom: "7px",
  fontWeight: "800",
  color: "#334155",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginBottom: "15px",
  borderRadius: "13px",
  border: "1px solid #cbd5e1",
  outline: "none",
  background: "#ffffff",
};

const submitBtn = {
  width: "100%",
  padding: "14px",
  borderRadius: "14px",
  border: "none",
  background: "linear-gradient(135deg, #f97316, #ec4899)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "900",
  fontSize: "16px",
  marginTop: "4px",
};

const bottomText = {
  marginTop: "18px",
  color: "#475569",
};

const linkBtn = {
  border: "none",
  background: "transparent",
  color: "#4f46e5",
  fontWeight: "900",
  cursor: "pointer",
};

export default Login;