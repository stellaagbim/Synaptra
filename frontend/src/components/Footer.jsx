// src/components/Footer.jsx
import React from "react";
import { Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer className="w-full text-center py-8 text-gray-400 text-sm border-t border-white/10">
      <Typography variant="caption">
        © {new Date().getFullYear()} Synaptra Core — Engineered by Stella Agbim
      </Typography>
    </footer>
  );
}
