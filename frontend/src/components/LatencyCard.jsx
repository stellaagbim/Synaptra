// src/components/LiveLatencyCard.jsx
import React from "react";
import { Paper, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function LiveLatencyCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
    >
      <Paper className="p-5 w-64 text-center border border-white/10 bg-white/5 backdrop-blur-md">
        <Typography variant="body2" color="text.secondary">
          Live Latency
        </Typography>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
          84 ms
        </Typography>
      </Paper>
    </motion.div>
  );
}
