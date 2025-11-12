import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../css/pinned.css";
import PostCard from "./PostCard";

export default function Pinned({ user, onTogglePin }) {
  const [pinnedPosts, setPinnedPosts] = useState([]);

  useEffect(() => {
    const fetchPinnedPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const pinsKey = "vwall_pins_v1_" + (user?.email || "guest");
        const pinnedIds = JSON.parse(localStorage.getItem(pinsKey) || "[]");

        if (pinnedIds.length === 0) {
          setPinnedPosts([]);
          return;
        }

        // ✅ Fetch all uploads
        const res = await axios.get("http://localhost:5000/api/upload", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ✅ Filter only pinned uploads
        const pinnedData = res.data.filter((file) =>
          pinnedIds.includes(file._id)
        );

        // ✅ Format for PostCard
        const formatted = pinnedData.map((file) => ({
          id: file._id,
          title: file.title || file.filename,
          description: file.description || "Uploaded file",
          url: `http://localhost:5000${file.filepath.replace(/\\/g, "/")}`,
          category: file.category || "General",
          date: new Date(file.createdAt).toLocaleString(),
        }));

        setPinnedPosts(formatted);
      } catch (err) {
        console.error("❌ Error fetching pinned posts:", err);
      }
    };

    fetchPinnedPosts();

    // 🔁 Re-fetch when pin/unpin happens
    window.addEventListener("storage", fetchPinnedPosts);
    return () => window.removeEventListener("storage", fetchPinnedPosts);
  }, [user]);

  return (
    <div className="pinned-page">
      <h2>Pinned Items</h2>
      {pinnedPosts.length === 0 ? (
        <p className="empty">You have no pinned items.</p>
      ) : (
        <div className="post-grid">
          {pinnedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onTogglePin={onTogglePin}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
