import React, { useState } from "react";
import "../../css/auth.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api"; // ✅ import from api.js

export default function RegisterStudent() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    regno: "",
    year: "",
    department: "",
    className: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await registerUser({ ...form, role: "student" });
      alert("✅ Registered successfully! Please login.");
      nav("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card card" onSubmit={handleSubmit}>
        <h2>Student Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Reg No" value={form.regno} onChange={(e) => setForm({ ...form, regno: e.target.value })} />
        <input placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
        <input placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
        <input placeholder="Class" value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button className="btn" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
