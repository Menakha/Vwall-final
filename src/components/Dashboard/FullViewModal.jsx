import React from "react";
import "../../css/home.css";

export default function FullViewModal({ post, onClose }) {
  return (
    <div
      className="fullview-overlay"
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        className="fullview-modal"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1c1c1c",
          borderRadius: "12px",
          padding: "20px",
          maxWidth: "90%",
          maxHeight: "90%",
          overflowY: "auto",
          color: "#fff",
          position: "relative",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "10px",
            right: "15px",
            background: "transparent",
            border: "none",
            color: "#ff6b6b",
            fontSize: "20px",
            cursor: "pointer",
          }}
        >
          ✖
        </button>

        {/* Title */}
        <h2
          style={{
            color: "#9A2E35",
            fontSize: "20px",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {post.title}
        </h2>

        {/* Image or PDF */}
        {post.fileType === "pdf" ? (
          <embed
            src={post.url}
            type="application/pdf"
            width="100%"
            height="400px"
            style={{ borderRadius: "8px", marginBottom: "10px" }}
          />
        ) : (
          <img
            src={post.url}
            alt={post.title}
            style={{
              width: "100%",
              borderRadius: "10px",
              objectFit: "contain",
              maxHeight: "400px",
              marginBottom: "10px",
            }}
          />
        )}

        {/* Description */}
        <p
          style={{
            fontSize: "15px",
            color: "#ccc",
            lineHeight: "1.6",
            textAlign: "justify",
            marginTop: "10px",
          }}
        >
          {post.description || "No description provided."}
        </p>

        {/* Date */}
        <p
          style={{
            fontSize: "13px",
            color: "#888",
            textAlign: "right",
            marginTop: "15px",
          }}
        >
          {new Date(post.date || post.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
