import React, { useState } from "react";
import "../../css/home.css";

export default function FullViewModal({ post, onClose }) {
  const [scale, setScale] = useState(1);

  const zoomIn = () => setScale((s) => Math.min(2.5, s + 0.25));
  const zoomOut = () => setScale((s) => Math.max(0.5, s - 0.25));
  const reset = () => setScale(1);

  return (
    <div className="fullview-overlay" onClick={onClose}>
      <div className="fullview-modal" onClick={(e) => e.stopPropagation()}>
        <div className="fv-header">
          <h3>{post.title}</h3>
          <div className="fv-controls">
            <button onClick={zoomOut}>−</button>
            <button onClick={reset}>Reset</button>
            <button onClick={zoomIn}>+</button>
            <button className="close" onClick={onClose}>Close</button>
          </div>
        </div>

        <div className="fv-body">
          <img src={post.url} alt={post.title} style={{ transform: `scale(${scale})` }} />
          <div className="fv-desc">
            <div className="file-meta">
              <strong>{post.fileName || "file"}</strong> • {new Date(post.date).toLocaleString()}
            </div>
            <p>{post.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
