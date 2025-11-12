// src/pages/auth/AuthLogin.jsx
import React, { useState } from "react";
import { loginUser } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import "../../css/auth.css";

export default function AuthLogin({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // ✅ Send login data
      const result = await loginUser({ email, password, role });

      // ✅ Check if backend returned a user and token
      if (result.user && result.token) {
        // Save token & user info in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("user", JSON.stringify(result.user));
        console.log("Token after login:", result.token);
        console.log("✅ Logged in user:", result.user);

        // ✅ Notify parent and redirect
        onLogin(result.user);
        alert("✅ Login successful!");
        navigate("/home");
      } else {
        setError(result.message || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      setError("Login failed. Check credentials or try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Login Portal</h2>

        {/* Role Toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`btn-toggle ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            type="button"
            className={`btn-toggle ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        {/* Login Form */}
        <form className="auth-section" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn" type="submit">
            Login
          </button>

          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
        </form>

        {/* Register Link */}
        <div style={{ textAlign: "center", marginTop: "10px" }}>
          <p className="muted small">
            New user?{" "}
            <Link
              to="/register"
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
