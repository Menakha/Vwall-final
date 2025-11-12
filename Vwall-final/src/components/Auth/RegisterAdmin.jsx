import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../api"; // ✅ already imported correctly

export default function RegisterAdmin() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [message, setMessage] = useState("");
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // ✅ Call your shared API helper
      const res = await registerUser({ ...form, role: "admin" });
      setMessage(res.message || "Admin registered successfully!");
      setTimeout(() => nav("/home"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #ffe5e5, #fff5f5)",
      }}
    >
      <form
        onSubmit={handleRegister}
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "40px",
          boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#7c2326" }}>Register Admin</h2>

        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "15px" }}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "15px" }}
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "15px" }}
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "15px" }}
        />

        <button
          type="submit"
          style={{
            background: "linear-gradient(180deg, #a52a2a, #7c2326)",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Register
        </button>

        {message && (
          <p style={{ textAlign: "center", color: "#a52a2a", fontWeight: "bold" }}>{message}</p>
        )}
      </form>
    </div>
  );
}
