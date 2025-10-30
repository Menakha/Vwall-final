import React, { useState } from "react";
import { UploadIcon } from "lucide-react";

export default function FloatingButton({ user, onClick }) {
  const [isHovered, setIsHovered] = useState(false); 



  // Only show this button if the logged-in user is an admin
   if (!user || user.role?.toLowerCase() !== "admin") return null;

  const buttonStyle = {
    position: "fixed",
    bottom: "90px",
    right: "25px",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(180deg, #b92b2b, #7c2326)",
    color: "white",
    fontSize: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 8px 30px rgba(154,46,53,0.2)",
    cursor: "pointer",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    zIndex: 1000,
    ...(isHovered && {
      transform: "scale(1.1)",
      boxShadow: "0px 12px 40px rgba(154,46,53,0.3)",
    }),
  };

  return (
    <button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      title="Upload File"
    >
      <UploadIcon size={28} />
    </button>
  );
}
