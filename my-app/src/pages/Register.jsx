import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [valid, setValid] = useState({
    length: false,
    letters: false,
    number: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    // Password validation
    if (name === "password") {
      setValid({
        length: value.length >= 8,
        letters: /[a-z]/.test(value) && /[A-Z]/.test(value),
        number: /\d/.test(value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.ok) {
        const message = await res.text();
        alert("Registration failed: " + message);
        return;
      }

      alert("Registered successfully!");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Logo / Header */}
        <h1 className="teknotes-title">
          <span className="red">Tek</span>
          <span className="gold">Notes</span>
        </h1>

        <p className="subtitle">Create Your Account</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Name Row */}
          <div className="row-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/* Password */}
          <div className="password-section">
            <input
              type="password"
              name="password"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              required
            />

            {/* Validation bullets */}
            <ul className="validation-list">
              <li className={valid.length ? "valid" : "invalid"}>
                At least 8 characters
              </li>
              <li className={valid.letters ? "valid" : "invalid"}>
                Upper & lowercase letters
              </li>
              <li className={valid.number ? "valid" : "invalid"}>
                At least one number
              </li>
            </ul>
          </div>

          {/* Confirm Password */}
          <input
            type="password"
            name="confirm"
            placeholder="Confirm your password"
            value={form.confirm}
            onChange={handleChange}
            required
          />

          {/* Submit */}
          <button className="auth-btn">Sign Up</button>
        </form>

        <p className="switch-auth">
          Already have an account?{" "}
          <Link to="/login" className="link">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}