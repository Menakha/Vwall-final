import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../../css/home.css";
import PostCard from "./PostCard";
import FloatingButton from "../Common/FloatingButton";
import UploadModal from "../Dashboard/UploadModal";

export default function Home({ posts = [], onTogglePin, user, onDelete, onUpload }) {
  const [activeTab, setActiveTab] = useState("Circulars");
  const [query, setQuery] = useState("");
  const [isUploadOpen, setUploadOpen] = useState(false);
  const [serverPosts, setServerPosts] = useState([]);

  const categories = ["Circulars", "Events", "UT"];

  // ✅ Fetch uploaded files from backend
  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/upload", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Map backend data to UI-friendly post structure
        const fetched = res.data.map((file) => ({
          id: file._id,
          title: file.filename,
          description: "Uploaded file",
          url: `http://localhost:5000/${file.filepath.replace(/\\/g, "/")}`,
          category: "Circulars", // default category (could be user-selected later)
          date: new Date(file.createdAt).toLocaleString(),
          fileType: file.filename.endsWith(".pdf") ? "pdf" : "image",
          pinnedBy: [],
        }));

        setServerPosts(fetched);
      } catch (err) {
        console.error("Error fetching uploads:", err);
      }
    };

    fetchUploads();
  }, []);

  // ✅ Merge local sample posts + backend uploads
  const allPosts = [...serverPosts, ...posts];

  // ✅ Filter by tab + search
  const filtered = useMemo(() => {
    return allPosts.filter(
      (p) =>
        p.category === activeTab &&
        p.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [allPosts, activeTab, query]);

  // ✅ Handle upload modal submit
  const handleUpload = (newPost) => {
    if (onUpload) onUpload(newPost);
    setUploadOpen(false);
  };

  return (
    <div className="home-page">
     
      

      {/* 🔹 Category Tabs */}
      <div className="tabs-row">
        {categories.map((c) => (
          <button
            key={c}
            className={`tab-btn ${activeTab === c ? "active" : ""}`}
            onClick={() => setActiveTab(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 🔹 Posts Grid */}
      <div className="grid-wrap">
        {filtered.length === 0 ? (
          <div className="empty">No posts found in {activeTab}.</div>
        ) : (
          <div className="post-grid">
            {filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onTogglePin={onTogglePin}
                user={user}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* ✅ Floating Upload (Admin only) */}
      {user?.role?.toLowerCase() === "admin" && (
        <FloatingButton user={user} onClick={() => setUploadOpen(true)} />
      )}

      {/* ✅ Upload Modal */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setUploadOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
