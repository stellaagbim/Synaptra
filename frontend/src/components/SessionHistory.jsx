import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Image as ImageIcon, Mic } from "lucide-react";

export default function SessionHistory({ items = [] }) {
  if (!items.length)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 0.5 }}
        className="glass empty"
      >
        <p style={{ padding: "1rem", color: "rgba(255,255,255,0.6)" }}>
          No activity yet — start interacting with Synaptra Core.
        </p>
      </motion.div>
    );

  return (
    <motion.div
      className="history-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {items.map((item, i) => {
        const Icon =
          item.kind === "image"
            ? ImageIcon
            : item.kind === "audio"
            ? Mic
            : MessageSquare;

        const bg =
          item.kind === "image"
            ? "rgba(94,231,255,0.07)"
            : item.kind === "audio"
            ? "rgba(140,255,186,0.07)"
            : "rgba(124,58,237,0.07)";

        const border =
          item.kind === "image"
            ? "1px solid rgba(94,231,255,0.3)"
            : item.kind === "audio"
            ? "1px solid rgba(140,255,186,0.3)"
            : "1px solid rgba(124,58,237,0.3)";

        return (
          <motion.div
            key={i}
            className="entry glass"
            style={{
              background: bg,
              border,
              borderRadius: "14px",
              padding: "0.9rem 1.2rem",
              marginBottom: "0.9rem",
              display: "flex",
              gap: "0.9rem",
              alignItems: "flex-start",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
          >
            <div
              style={{
                flexShrink: 0,
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "rgba(255,255,255,0.05)",
              }}
            >
              <Icon size={20} color="#5ee7ff" />
            </div>
            <div>
              <p
                style={{
                  fontSize: "0.95rem",
                  color: "rgba(255,255,255,0.85)",
                  whiteSpace: "pre-wrap",
                  lineHeight: "1.5",
                }}
              >
                {item.content}
              </p>
              <p
                style={{
                  marginTop: "0.4rem",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.45)",
                  letterSpacing: "0.3px",
                }}
              >
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
