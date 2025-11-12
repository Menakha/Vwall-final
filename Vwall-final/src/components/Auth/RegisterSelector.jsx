// src/pages/auth/RegisterSelector.jsx
import React, { useState } from "react";
import RegisterStudent from "./RegisterStudent";
import RegisterAdmin from "./RegisterAdmin";
import "../../css/auth.css";

export default function RegisterSelector({ onRegister }) {
  const [role, setRole] = useState("student"); // default student

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <h2>Register Portal</h2>

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
            <RegisterStudent onRegister={onRegister} />
          ) : (
            <RegisterAdmin onRegister={onRegister} />
          )}
        </div>
      </div>
    </div>
  );
}
