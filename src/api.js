import axios from "axios";

// ✅ Create axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth", // update this if backend URL changes
});

// 🔹 Login user (student/admin)
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);

    const user = res.data.user;
    if (user) {
      // ✅ Store user info in localStorage for session management
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // ✅ Redirect based on role
      if (user.role === "admin") {
        window.location.href = "/home";
      } else {
        window.location.href = "/home";
      }
    }

    return res.data;
  } catch (err) {
    console.error("Login error:", err);
    return { message: err.response?.data?.message || "Server error during login" };
  }
};

// 🔹 Register user (student/admin)
export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);

    // ✅ Auto-login after registration (optional)
    if (res.data.user) {
      const user = res.data.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      // ✅ Redirect based on role
      if (user.role === "admin") {
        window.location.href = "/home";
      } else {
        window.location.href = "/home";
      }
    }

    return res.data;
  } catch (err) {
    console.error("Registration error:", err);
    return { message: err.response?.data?.message || "Registration failed" };
  }
};

// ✅ Optional default export (if you want to import all functions together)
export default {
  loginUser,
  registerUser,
};
