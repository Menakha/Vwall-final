import React, { useState } from "react";
import { registerUser } from "../../api";
import { useNavigate, Link } from "react-router-dom"; // ✅ added Link
import "../../css/auth.css";

export default function AuthRegister() {
  const [role, setRole] = useState("student");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    regno: "",
    year: "",
    department: "",
    className: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const result = await registerUser({ ...form, role });
    if (result.user) {
      alert("✅ Registered successfully!");
      navigate("/home"); // ✅ redirect to login page
    } else {
      setMessage(result.message || "Registration failed!");
    }
  };

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

        <form className="auth-section" onSubmit={handleSubmit}>
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            required
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {role === "student" && (
            <>
              <input
                placeholder="Register No"
                value={form.regno}
                onChange={(e) => setForm({ ...form, regno: e.target.value })}
              />
              <input
                placeholder="Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
              <input
                placeholder="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({ ...form, department: e.target.value })
                }
              />
              <input
                placeholder="Class"
                value={form.className}
                onChange={(e) => setForm({ ...form, className: e.target.value })}
              />
            </>
          )}

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            required
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="btn">Register</button>
        </form>

        {message && (
          <p style={{ color: "green", textAlign: "center" }}>{message}</p>
        )}

        {/* ✅ Add this line below */}
        <p style={{ textAlign: "center", marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
