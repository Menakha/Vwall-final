import React from "react";
import "../../css/pinned.css";
import PostCard from "./PostCard";

export default function Pinned({ pinnedPosts, onTogglePin, user }) {
  return (
    <div className="pinned-page">
      <h2>Pinned Items</h2>
      {pinnedPosts.length === 0 ? (
        <p className="empty">You have no pinned items.</p>
      ) : (
        <div className="post-grid">
          {pinnedPosts.map((p) => (
            <PostCard key={p.id} post={p} onTogglePin={onTogglePin} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
