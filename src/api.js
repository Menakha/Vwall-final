import axios from "axios";

// ✅ Backend base URL
const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

// 🔹 Login user (student/admin)
export const loginUser = async (data) => {
  try {
    const res = await API.post("/login", data);
    const { user, token } = res.data;

    if (user && token) {
      // ✅ Store both user and token correctly
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", token);

      console.log("✅ Token stored:", token);
    } else {
      console.error("⚠️ No token or user received from backend.");
    }

    return res.data;
  } catch (err) {
    console.error("❌ Login error:", err);
    return { message: err.response?.data?.message || "Server error during login" };
  }
};

// 🔹 Register user (student/admin)
export const registerUser = async (data) => {
  try {
    const res = await API.post("/register", data);
    const { user, token } = res.data;

    if (user && token) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      localStorage.setItem("token", token);

      console.log("✅ Registered and token stored:", token);
    }

    return res.data;
  } catch (err) {
    console.error("❌ Registration error:", err);
    return { message: err.response?.data?.message || "Registration failed" };
  }
};

export default { loginUser, registerUser };
