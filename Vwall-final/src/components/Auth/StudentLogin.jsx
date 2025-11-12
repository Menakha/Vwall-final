import React, { useState } from "react";
import { loginUser } from "../../api";
import { useNavigate } from "react-router-dom";


export default function StudentLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser({ email, password });

      if (result?.user) {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(result.user));

        if (onLogin) onLogin(result.user);
        alert("✅ Login Successful!");

        // Redirect based on role
        if (result.user.role === "student") {
          navigate("/home");
        } else if (result.user.role === "admin") {
          navigate("/home");
        } else {
          navigate("/");
        }
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Student Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
