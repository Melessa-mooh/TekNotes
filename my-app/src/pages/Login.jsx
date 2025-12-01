import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

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
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 401) {
        alert("Invalid email or password");
        return;
      }

      if (!res.ok) {
        alert("Login failed");
        return;
      }

      const user = await res.json();
      // Optional: store user in localStorage
      localStorage.setItem("teknotesUser", JSON.stringify(user));

      alert("Successfully logged in!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
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