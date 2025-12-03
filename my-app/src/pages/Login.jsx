import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import ApiService from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await ApiService.login(formData);

      // Make sure we have an id/userId (coming from MySQL via backend)
      const userId = user.id ?? user.userId;
      if (!userId) {
        console.error("Login response missing user id:", user);
        alert("Login response invalid.");
        return;
      }

      // Store full user object for later (Dashboard will read id from here)
      localStorage.setItem("teknotesUser", JSON.stringify(user));

      alert("Successfully logged in!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.message.includes('401')) {
        alert("Invalid email or password");
      } else {
        alert("Server error. Please try again.");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">
          <span className="logo-red">Tek</span>
          <span className="logo-yellow">Notes</span>
        </h1>

        <p className="auth-subtitle">Welcome to Your Learning Hub</p>

        <form onSubmit={handleLogin} className="auth-form">
          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />

          {/* Password */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />

          {/* Button */}
          <button type="submit" className="auth-btn">
            Sign In
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}