// src/pages/auth/AuthSelector.jsx
import React, { useState } from "react";
import StudentLogin from "./StudentLogin";
import AdminLogin from "./AdminLogin";
import { Link } from "react-router-dom";
import "../../css/auth.css";

export default function AuthSelector({ onLogin }) {
  const [role, setRole] = useState("student"); // default student

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Login Portal</h2>

        <div className="role-toggle">
          <button
            className={`btn-toggle ${role === "student" ? "active" : ""}`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`btn-toggle ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <div className="auth-section">
          {role === "student" ? (
            <StudentLogin onLogin={onLogin} />
          ) : (
            <AdminLogin onLogin={onLogin} />
          )}
        </div>

        <div className="muted small" style={{ textAlign: "center", marginTop: "10px" }}>
          New user?{" "}
          <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
}
