import React from "react";
import { motion } from "framer-motion";
import { Cpu, Github } from "lucide-react";

export default function Navbar() {
  return (
    <motion.nav
      className="navbar glass"
      initial={{ opacity: 0, y: -25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.9rem 2rem",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Left Section - Logo */}
      <motion.div
        className="brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontWeight: 800,
          fontSize: "1.3rem",
          letterSpacing: "0.4px",
          color: "#5ee7ff",
          cursor: "pointer",
        }}
      >
        <Cpu size={22} /> Synaptra Core
      </motion.div>

      {/* Right Section - GitHub Link */}
      <motion.a
        href="https://github.com/stellaagbim/Synaptra"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{
          scale: 1.08,
          color: "#7c3aed",
          textShadow: "0 0 12px #7c3aed",
        }}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "rgba(255,255,255,0.7)",
          textDecoration: "none",
          fontWeight: 500,
          letterSpacing: "0.3px",
        }}
      >
        <Github size={18} /> GitHub
      </motion.a>
    </motion.nav>
  );
}
