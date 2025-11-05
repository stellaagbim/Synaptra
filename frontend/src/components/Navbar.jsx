// src/components/Navbar.jsx
import React from "react";
import { motion } from "framer-motion";
import PsychologyIcon from "@mui/icons-material/Psychology";
import MemoryIcon from "@mui/icons-material/Memory";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="navbar"
    >
      <div className="flex items-center gap-2">
        <PsychologyIcon color="primary" />
        <h1 className="text-lg font-bold tracking-tight">Synaptra Core</h1>
      </div>
      <div className="flex items-center gap-2 text-sm opacity-80">
        <span>v3.0</span>
        <MemoryIcon fontSize="small" />
      </div>
    </motion.nav>
  );
}
