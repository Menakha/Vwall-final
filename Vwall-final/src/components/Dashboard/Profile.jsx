import React from "react";
import "../../css/profile.css";
import { Link } from "react-router-dom";

export default function Profile({ user, onLogout }) {
  if (!user) {
    return (
      <div className="profile-empty">
        <p>You are not logged in.</p>
        <div className="auth-links">
          <Link to="/login/student" className="btn ghost">Student Login</Link>
          <Link to="/login/admin" className="btn">Admin Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card card">
        <div className="profile-top">
          <div className="avatar-lg">{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <h3>{user.name}</h3>
            <div className="muted">{user.role}</div>
          </div>
        </div>

        <div className="profile-details">
          <div><strong>Email:</strong> {user.email}</div>
          {user.regno && <div><strong>Reg No:</strong> {user.regno}</div>}
          {user.department && <div><strong>Department:</strong> {user.department}</div>}
          {user.className && <div><strong>Class:</strong> {user.className}</div>}
          <div><strong>Phone:</strong> {user.phone || "—"}</div>
        </div>

        <div className="profile-actions">
          <button className="btn" onClick={onLogout}>Logout</button>
        </div>
      </div>
    </div>
  );
}
