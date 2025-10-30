import React, { useState } from "react";
import axios from "axios"; // ✅ Use axios directly (or API instance if configured)

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [fileObj, setFileObj] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Circulars");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  // ✅ Handle file selection
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileObj(f);
  };

  // ✅ Handle file upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileObj) return alert("Please choose a file first.");

    const formData = new FormData();
    formData.append("file", fileObj);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);

    try {
      setUploading(true);
      setError("");

      // ✅ Upload file to backend
      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ File uploaded successfully!");
      if (onUpload) onUpload(res.data);

      // ✅ Reset form
      setTitle("");
      setDescription("");
      setFileObj(null);
      setCategory("Circulars");
      onClose();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      background: "#fff",
      borderRadius: "16px",
      padding: "30px",
      width: "90%",
      maxWidth: "420px",
      boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
    },
    title: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
      color: "#7c2326",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
      outline: "none",
      width: "100%",
      marginBottom: "10px",
    },
    textarea: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
      minHeight: "80px",
      resize: "none",
      width: "100%",
      marginBottom: "10px",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "14px",
      width: "100%",
      marginBottom: "10px",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "15px",
    },
    btn: {
      padding: "10px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
    },
    uploadBtn: {
      background: "linear-gradient(180deg, #b92b2b, #7c2326)",
      color: "white",
    },
    cancelBtn: {
      background: "#eee",
      color: "#333",
    },
    error: {
      color: "red",
      fontSize: "13px",
      textAlign: "center",
    },
    fileInfo: {
      fontSize: "13px",
      color: "#333",
      marginTop: "-5px",
      marginBottom: "8px",
    },
    preview: {
      marginTop: "10px",
      textAlign: "center",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Upload Post</h3>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* File input */}
          <input
            type="file"
            id="uploadFile"
            name="file"
            onChange={handleFile}
            accept="image/*,application/pdf"
            style={styles.input}
          />

          {/* ✅ Show selected file name */}
          {fileObj && (
            <p style={styles.fileInfo}>
              <strong>Selected:</strong> {fileObj.name} (
              {Math.round(fileObj.size / 1024)} KB)
            </p>
          )}

          {/* ✅ Preview selected file */}
          {fileObj && (
            <div style={styles.preview}>
              {fileObj.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(fileObj)}
                  alt="Preview"
                  style={{ maxWidth: "100%", borderRadius: "10px" }}
                />
              ) : fileObj.type === "application/pdf" ? (
                <embed
                  src={URL.createObjectURL(fileObj)}
                  width="100%"
                  height="200px"
                  type="application/pdf"
                />
              ) : null}
            </div>
          )}

          <input
            required
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />
          <textarea
            required
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={styles.select}
          >
            <option value="Circulars">Circulars</option>
            <option value="Events">Events</option>
            <option value="UT">UT</option>
          </select>

          <div style={styles.actions}>
            <button
              type="submit"
              style={{ ...styles.btn, ...styles.uploadBtn }}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
            <button
              type="button"
              style={{ ...styles.btn, ...styles.cancelBtn }}
              onClick={() => {
                setTitle("");
                setDescription("");
                setFileObj(null);
                onClose();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
