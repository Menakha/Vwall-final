import React, { useState } from "react";
import "../../css/home.css";
import FullViewModal from "./FullViewModal";
import {
  Pin,
  PinOff,
  Share2,
  Download,
  Trash2,
} from "lucide-react"; // ✅ Lucide icons



export default function PostCard({ post, onTogglePin, user, onDelete }) {
  const [hovered, setHovered] = useState(false);
  const [open, setOpen] = useState(false);

  const pinsKey = "vwall_pins_v1_" + (user?.email || "guest");
  const userPins = JSON.parse(localStorage.getItem(pinsKey) || "[]");
  const isPinned = userPins.includes(post.id);

  const BASE_URL = "http://localhost:5000"; // backend URL
  const imageUrl = post.url
    ? post.url
    : `${BASE_URL}/${post.filepath?.replace(/\\/g, "/")}`;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = post.filename || "file";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.description,
          url: imageUrl,
        });
      } catch (err) {
        console.log("Share canceled", err);
      }
    } else {
      await navigator.clipboard.writeText(imageUrl);
      alert("Post link copied to clipboard");
    }
  };

  return (
    <>
      <div
        className="post-card"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="media-wrap" onClick={() => setOpen(true)}>
          <img src={imageUrl} alt={post.title} />
        </div>

        <div className="post-body">
          <div className="post-top">
            <h3 className="post-title">{post.title}</h3>
            <div className="post-meta">
              {new Date(post.date).toLocaleString()}
            </div>
          </div>

          <p className="post-desc">
            {post.description.length > 120 ? (
              <>
                {post.description.slice(0, 120)}
                <span className="dots">...</span>
                <button className="read-more" onClick={() => setOpen(true)}>
                  Read more
                </button>
              </>
            ) : (
              post.description
            )}
          </p>
        </div>
          {/* 🔹 Lucide Icon Buttons */}
        <div className={`card-icons ${hovered ? "visible" : ""}`}>
          <button
            className={`icon-btn ${isPinned ? "pinned" : ""}`}
            onClick={() => onTogglePin(post.id)}
            title={isPinned ? "Unpin Post" : "Pin Post"}
          >
            {isPinned ? <PinOff size={18} /> : <Pin size={18} />}
          </button>

          <button
            className="icon-btn"
            onClick={handleDownload}
            title="Download File"
          >
            <Download size={18} />
          </button>

          <button
            className="icon-btn"
            onClick={handleShare}
            title="Share Link"
          >
            <Share2 size={18} />
          </button>

          {user?.role === "admin" && (
            <button
              className="icon-btn danger"
              onClick={() => onDelete(post.id)}
              title="Delete Post"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {open && <FullViewModal post={post} onClose={() => setOpen(false)} />}
    </>
  );
}

        
