import React, { useState } from "react";
import axios from "axios";

export default function UploadModal({ isOpen, onClose, onUpload }) {
  const [fileObj, setFileObj] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Circulars");
  const [expiryDate, setExpiryDate] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFileObj(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileObj) return alert("Please choose a file first.");

    const token = localStorage.getItem("token");
    if (!token) return alert("⚠️ No token found. Please log in again.");

    const formData = new FormData();
    formData.append("file", fileObj);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    if (expiryDate) formData.append("expiryDate", expiryDate); // ✅ Optional expiry date

    try {
      setUploading(true);
      setError("");

      const res = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ File uploaded successfully!");
      if (onUpload) onUpload(res.data);

      // Reset form
      setTitle("");
      setDescription("");
      setFileObj(null);
      setCategory("Circulars");
      setExpiryDate("");
      onClose();
    } catch (err) {
      console.error("❌ Upload error:", err.response?.data || err.message);
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
      background: "rgba(0,0,0,0.85)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: "20px",
    },
    modal: {
      background: "#121212",
      borderRadius: "16px",
      padding: "30px",
      width: "100%",
      maxWidth: "480px",
      boxShadow: "0 0 25px rgba(255,255,255,0.1)",
      color: "#f2f2f2",
      display: "flex",
      flexDirection: "column",
      maxHeight: "90vh",
      overflowY: "auto",
    },
    title: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "20px",
      textAlign: "center",
      color: "#9a2e35",
      textShadow: "0 0 8px ",
    },
    input: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #444",
      background: "#1e1e1e",
      color: "#fff",
      fontSize: "14px",
      outline: "none",
      width: "100%",
      marginBottom: "12px",
    },
    textarea: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #444",
      background: "#1e1e1e",
      color: "#fff",
      fontSize: "14px",
      minHeight: "80px",
      resize: "none",
      width: "100%",
      marginBottom: "12px",
    },
    select: {
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #444",
      background: "#1e1e1e",
      color: "#fff",
      fontSize: "14px",
      width: "100%",
      marginBottom: "12px",
    },
    actions: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "20px",
    },
    btn: {
      flex: 1,
      margin: "0 5px",
      padding: "12px 18px",
      borderRadius: "8px",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      transition: "0.3s",
    },
    uploadBtn: {
      background: "linear-gradient(135deg, #9a2e35)",
      color: "white",
      boxShadow: "0 0 10px #9a2e35",
    },
    cancelBtn: {
      background: "#333",
      color: "#eee",
      border: "1px solid #555",
    },
    error: {
      color: "#ff6b6b",
      fontSize: "13px",
      textAlign: "center",
    },
    fileInfo: {
      fontSize: "13px",
      color: "#ccc",
      marginBottom: "8px",
    },
    preview: {
      marginTop: "10px",
      textAlign: "center",
      border: "1px solid #333",
      borderRadius: "10px",
      padding: "10px",
      background: "#1c1c1c",
    },
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={styles.title}>Upload File</h3>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="file"
            id="uploadFile"
            name="file"
            onChange={handleFile}
            accept="image/*,application/pdf"
            style={styles.input}
          />

          {fileObj && (
            <>
              <p style={styles.fileInfo}>
                <strong>Selected:</strong> {fileObj.name} (
                {Math.round(fileObj.size / 1024)} KB)
              </p>

              <div style={styles.preview}>
                {fileObj.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(fileObj)}
                    alt="Preview"
                    style={{ maxWidth: "100%", borderRadius: "8px" }}
                  />
                ) : (
                  <embed
                    src={URL.createObjectURL(fileObj)}
                    width="100%"
                    height="200px"
                    type="application/pdf"
                  />
                )}
              </div>
            </>
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

          {/* ✅ Optional expiry date */}
          
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            style={styles.input}
            placeholder="End Date(optional)"
          />

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
                setExpiryDate("");
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
