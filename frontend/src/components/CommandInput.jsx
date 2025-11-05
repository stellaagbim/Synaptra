// src/components/CommandInput.jsx
import React, { useState } from "react";
import { TextField, Button, Paper } from "@mui/material";
import { motion } from "framer-motion";
import { fadeInUp } from "../motionVariants";

export default function CommandInput() {
  const [command, setCommand] = useState("");

  const handleSubmit = () => {
    console.log("Command Sent:", command);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="show"
      className="w-full max-w-2xl"
    >
      <Paper className="p-6 bg-white/5">
        <TextField
          fullWidth
          label="Enter Command..."
          variant="outlined"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          sx={{
            mb: 2,
            input: { color: "#E5E7EB" },
            label: { color: "#9CA3AF" },
          }}
        />
        <Button fullWidth variant="contained" onClick={handleSubmit}>
          Run Agent
        </Button>
      </Paper>
    </motion.div>
  );
}
