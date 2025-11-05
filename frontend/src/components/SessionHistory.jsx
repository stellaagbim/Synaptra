// src/components/SessionHistory.jsx
import React from "react";
import { Paper, Typography } from "@mui/material";

export default function SessionHistory() {
  const history = [
    { id: 1, type: "text", input: "Describe the image", output: "A cat on a chair." },
    { id: 2, type: "audio", input: "audio.wav", output: "Hello world transcript" },
  ];

  return (
    <Paper className="p-6 mt-10 w-full max-w-3xl bg-white/5 border border-white/10 backdrop-blur-md">
      <Typography variant="h6" color="primary" gutterBottom>
        Session History
      </Typography>
      {history.map((item) => (
        <div key={item.id} className="py-2 border-b border-white/10">
          <Typography variant="subtitle2" color="secondary">
            {item.type.toUpperCase()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {item.input} → {item.output}
          </Typography>
        </div>
      ))}
    </Paper>
  );
}
