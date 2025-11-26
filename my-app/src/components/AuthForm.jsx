import React, { useState } from "react";
import "../styles/auth.css";
import { Link } from "react-router-dom";

export default function AuthForm({ mode, onSubmit }) {
  const isLogin = mode === "login";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1 className="logo">
          Tek<span>Notes</span>
        </h1>

        <h2>{isLogin ? "Welcome to Your Learning Hub" : "Create Your Account"}</h2>

        <form onSubmit={handleSubmit} className="auth-form">

          {!isLogin && (
            <>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />

              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            {isLogin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? (
            <>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login">Sign In</Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}