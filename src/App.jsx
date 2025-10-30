import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Common/Navbar";
import FloatingButton from "./components/Common/FloatingButton";
import Home from "./components/Dashboard/Home";
import Pinned from "./components/Dashboard/Pinned";
import Profile from "./components/Dashboard/Profile";
import UploadModal from "./components/Dashboard/UploadModal";
import AdminLogin from "./components/Auth/AdminLogin";
import StudentLogin from "./components/Auth/StudentLogin";
import RegisterStudent from "./components/Auth/RegisterStudent";
import RegisterAdmin from "./components/Auth/RegisterAdmin";
import AuthSelector from "./components/Auth/AuthSelector";
import RegisterSelector from "./components/Auth/RegisterSelector";
import "./css/theme.css";
import "./css/bottomnav.css";
import { HomeIcon, BookmarkIcon, UserIcon } from "lucide-react";

const STORAGE_KEYS = {
  POSTS: "vwall_posts_v1",
  USER: "vwall_user_v1",
  PINS_PREFIX: "vwall_pins_v1_",
};

// ✅ Removed placeholder.com URLs to avoid network errors
const samplePosts = [
  {
    id: "p1",
    title: "Cloud Computing Workshop",
    description:
      "A 3-day hands-on workshop on cloud fundamentals and DevOps practices. Limited seats.",
    fileName: "cloud_workshop.png",
    fileType: "image",
    url: "",
    category: "Events",
    date: new Date().toLocaleString(),
    pinnedBy: [],
  },
  {
    id: "p2",
    title: "Midterm Circular",
    description:
      "Midterm exam schedule released. Check dates and venue. Please contact your class teacher for queries.",
    fileName: "midterm.pdf",
    fileType: "pdf",
    url: "",
    category: "Circulars",
    date: new Date().toLocaleString(),
    pinnedBy: [],
  },
];

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  });

  const [posts, setPosts] = useState(() => {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTS);
    return raw ? JSON.parse(raw) : samplePosts;
  });

  const [isUploadOpen, setUploadOpen] = useState(false);

  // ✅ Persist posts to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  // ✅ Persist user info
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  }, [user]);

  // ✅ Handle login
  const handleLogin = (userObj) => {
    console.log("✅ Logged in:", userObj);
    setUser(userObj);
    const pinsKey = STORAGE_KEYS.PINS_PREFIX + userObj.email;
    if (!localStorage.getItem(pinsKey)) {
      localStorage.setItem(pinsKey, JSON.stringify([]));
    }
    navigate("/home");
  };

  // ✅ Handle logout
  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  // ✅ Handle new uploads with file preview
  const handleUpload = (uploadData) => {
    const fileUrl = uploadData.file
      ? URL.createObjectURL(uploadData.file)
      : "";

    const newPost = {
      id: "p" + Date.now(),
      title: uploadData.title,
      description: uploadData.description,
      fileName: uploadData.file?.name || "",
      fileType: uploadData.file?.type?.startsWith("image") ? "image" : "file",
      url: fileUrl, // ✅ Local preview URL
      category: uploadData.category || "Circulars",
      date: new Date().toLocaleString(),
      pinnedBy: [],
    };

    setPosts((prev) => [newPost, ...prev]);
  };

  // ✅ Toggle pin/unpin
  const togglePin = (postId) => {
    if (!user) return alert("Please login to pin posts.");
    const pinsKey = STORAGE_KEYS.PINS_PREFIX + user.email;
    const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
    const idx = existing.indexOf(postId);
    if (idx === -1) existing.unshift(postId);
    else existing.splice(idx, 1);
    localStorage.setItem(pinsKey, JSON.stringify(existing));

    setPosts((p) =>
      p.map((post) =>
        post.id === postId
          ? {
              ...post,
              pinnedBy:
                post.pinnedBy && post.pinnedBy.includes(user.email)
                  ? post.pinnedBy.filter((e) => e !== user.email)
                  : [...(post.pinnedBy || []), user.email],
            }
          : post
      )
    );
  };

  // ✅ Get pinned posts for user
  const getPinnedForUser = (u) => {
    if (!u) return [];
    const pinsKey = STORAGE_KEYS.PINS_PREFIX + u.email;
    const existing = JSON.parse(localStorage.getItem(pinsKey) || "[]");
    return posts.filter((p) => existing.includes(p.id));
  };

  // ✅ Delete post (admin only)
  const handleDeletePost = (postId) => {
    if (!user || user.role !== "admin")
      return alert("Only admin can delete posts.");
    if (!confirm("Delete this post?")) return;
    setPosts((p) => p.filter((x) => x.id !== postId));
    Object.keys(localStorage).forEach((k) => {
      if (k.startsWith(STORAGE_KEYS.PINS_PREFIX)) {
        const arr = JSON.parse(localStorage.getItem(k) || "[]").filter(
          (id) => id !== postId
        );
        localStorage.setItem(k, JSON.stringify(arr));
      }
    });
  };

  // ✅ Default login/register routes (if not logged in)
  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<AuthSelector onLogin={handleLogin} />} />
        <Route path="/register" element={<RegisterSelector onRegister={handleLogin} />} />
        <Route path="/login/admin" element={<AdminLogin onLogin={handleLogin} />} />
        <Route path="/login/student" element={<StudentLogin onLogin={handleLogin} />} />
        <Route path="/register/admin" element={<RegisterAdmin onRegister={handleLogin} />} />
        <Route path="/register/student" element={<RegisterStudent onRegister={handleLogin} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  // ✅ Dashboard view (after login)
  return (
    <div className="app-root">
      <Navbar user={user} onLogout={handleLogout} />

      <Routes>
        <Route
          path="/home"
          element={
            <Home
              posts={posts}
              onTogglePin={togglePin}
              onOpenUpload={() => setUploadOpen(true)}
              onDelete={handleDeletePost}
              user={user}
            />
          }
        />
        <Route
          path="/pinned"
          element={
            <Pinned
              pinnedPosts={getPinnedForUser(user)}
              onTogglePin={togglePin}
              user={user}
            />
          }
        />
        <Route path="/profile" element={<Profile user={user} onLogout={handleLogout} />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>

      {/* ✅ Floating Upload for Admins */}
      {user?.role === "admin" && (
        <FloatingButton onClick={() => setUploadOpen(true)} title="Upload" />
      )}

      {/* ✅ Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />

      {/* ✅ Bottom Navigation */}
      <nav className="bottom-nav">
        <Link to="/home" className="nav-item" title="Home">
          <HomeIcon size={24} />
        </Link>
        <Link to="/pinned" className="nav-item" title="Pinned">
          <BookmarkIcon size={24} />
        </Link>
        <Link to="/profile" className="nav-item" title="Profile">
          <UserIcon size={24} />
        </Link>
      </nav>
    </div>
  );
}

export default App;
