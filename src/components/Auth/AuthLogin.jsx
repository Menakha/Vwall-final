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
      const result = await loginUser({ email, password, role });

      if (result.user && result.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("role", result.user.role);
        localStorage.setItem("user", JSON.stringify(result.user));
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
      <div className="auth-card">
        <h2>Login Portal</h2>

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

        <form className="auth-section" onSubmit={handleSubmit}>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit">
            Login
          </button>

          {error && <p className="auth-error">{error}</p>}
        </form>

        <div className="auth-footer">
          New user?{" "}
          <Link to="/register" className="auth-link">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
