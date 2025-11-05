import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, ImageIcon, Mic } from "lucide-react";

export default function FileUpload({ label = "Upload", onSelect }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(null);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("audio/")) {
      setPreview("AUDIO");
    }

    onSelect && onSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange({ target: { files: [file] } });
    }
  };

  const openFileDialog = () => fileInput.current?.click();

  return (
    <motion.div
      className={`glass card upload-zone ${dragging ? "dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      style={{
        textAlign: "center",
        padding: "22px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
      onClick={openFileDialog}
    >
      <input
        type="file"
        accept="image/*,audio/*"
        ref={fileInput}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            alignItems: "center",
            color: "#5ee7ff",
          }}
        >
          <Upload size={20} />
          <span style={{ fontWeight: 700, letterSpacing: "0.3px" }}>
            {label}
          </span>
        </div>

        {preview ? (
          preview === "AUDIO" ? (
            <div
              style={{
                marginTop: "16px",
                color: "#8dffab",
                fontWeight: 600,
                fontSize: "15px",
              }}
            >
              <Mic size={16} style={{ marginRight: "6px" }} />
              Audio File Loaded
            </div>
          ) : (
            <motion.img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                maxHeight: "180px",
                borderRadius: "10px",
                marginTop: "12px",
                objectFit: "cover",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          )
        ) : (
          <p
            style={{
              marginTop: "14px",
              color: "rgba(255,255,255,0.65)",
              fontSize: "14px",
              letterSpacing: "0.2px",
            }}
          >
            Drop your file here or click to browse
          </p>
        )}
      </motion.div>

      {dragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(94,231,255,0.08)",
            border: "2px dashed rgba(94,231,255,0.6)",
            borderRadius: "18px",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />
      )}
    </motion.div>
  );
}
