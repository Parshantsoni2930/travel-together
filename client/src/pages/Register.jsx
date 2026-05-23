import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
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

    try {
      setLoading(true);

      await registerUser({
        name: formData.name.trim(),
        email:
          formData.email.toLowerCase(),
        password:
          formData.password,
      });

      toast.success(
        "Account created!"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data
          ?.message ||
          "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={heroPanel}>
        <div style={heroOverlay}></div>

        <div style={heroContent}>
          <span style={heroBadge}>
            Adventure • Travel •
            Community
          </span>

          <h1 style={heroTitle}>
            Start Your Journey
          </h1>

          <p style={heroText}>
            Create your account and
            discover travelers who
            match your vibe,
            destination, and travel
            style.
          </p>
        </div>
      </div>

      <div style={authCard}>
        <div style={logoCircle}>
          🌍
        </div>

        <h2 style={titleStyle}>
          Create Account
        </h2>

        <p style={subtitleStyle}>
          Join Travel Buddy Finder
          and start exploring
          together.
        </p>

        <form
          onSubmit={handleSubmit}
        >
          <label style={labelStyle}>
            Name
          </label>

          <input
            style={inputStyle}
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Email
          </label>

          <input
            style={inputStyle}
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label style={labelStyle}>
            Password
          </label>

          <input
            style={inputStyle}
            type="password"
            name="password"
            placeholder="Create a password"
            value={
              formData.password
            }
            onChange={handleChange}
            required
            minLength={6}
          />

          <button
            type="submit"
            style={submitBtn}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : "Register"}
          </button>
        </form>

        <p style={bottomText}>
          Already have an account?{" "}
          <button
            onClick={() =>
              navigate("/login")
            }
            style={linkBtn}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

/* KEEP YOUR EXISTING STYLES SAME */

export default Register;