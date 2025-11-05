import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap } from "lucide-react";

export default function LatencyCard({ latency = 0 }) {
  const getStatus = (ms) => {
    if (ms < 100) return "ultra-fast";
    if (ms < 300) return "optimal";
    if (ms < 600) return "moderate";
    return "delayed";
  };

  const status = getStatus(latency);

  return (
    <motion.div
      className="latency glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="label">System Latency</div>

      <AnimatePresence mode="wait">
        <motion.div
          key={latency}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          className="value"
        >
          {latency ? `${latency} ms` : "—"}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="status"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          marginTop: "6px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "6px",
          color:
            status === "ultra-fast"
              ? "#5ee7ff"
              : status === "optimal"
              ? "#8dffab"
              : status === "moderate"
              ? "#fcd34d"
              : "#f87171",
          fontWeight: 600,
          letterSpacing: "0.3px",
        }}
      >
        <Zap size={14} /> {status.toUpperCase()}
      </motion.div>
    </motion.div>
  );
}
