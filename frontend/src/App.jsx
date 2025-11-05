import React, { useState } from "react";
import { ThemeProvider, CssBaseline, Container, Grid } from "@mui/material";
import { motion } from "framer-motion";
import theme from "./theme";
import Navbar from "./components/Navbar";
import LatencyCard from "./components/LatencyCard";
import FileUpload from "./components/FileUpload";
import SessionHistory from "./components/SessionHistory";

export default function App() {
  const [history, setHistory] = useState([]);
  const [latency, setLatency] = useState(0);

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const start = performance.now();
    const isImage = file.type.startsWith("image/");
    const endpoint = isImage
      ? "http://127.0.0.1:8000/caption/"
      : "http://127.0.0.1:8000/transcribe/";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      const end = performance.now();

      const result =
        json.caption || json.transcription || "No response received.";
      const newItem = {
        kind: isImage ? "image" : "audio",
        content: result,
      };

      setLatency(Math.round(end - start));
      setHistory((prev) => [newItem, ...prev]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          background:
            "radial-gradient(circle at top, #0d1528 0%, #06080f 60%, #000 100%)",
          minHeight: "100vh",
          overflowX: "hidden",
          color: "white",
        }}
      >
        <Navbar />

        {/* Background Glow Animation */}
        <motion.div
          className="bg-glow"
          animate={{
            background: [
              "radial-gradient(circle at 20% 30%, rgba(94,231,255,0.15), transparent 70%)",
              "radial-gradient(circle at 70% 60%, rgba(124,58,237,0.15), transparent 70%)",
              "radial-gradient(circle at 50% 20%, rgba(94,231,255,0.15), transparent 70%)",
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="lg" sx={{ pt: 6, position: "relative", zIndex: 1 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <LatencyCard latency={latency} />
              <div style={{ marginTop: "1.5rem" }}>
                <FileUpload label="Upload Image" onSelect={handleFileUpload} />
                <div style={{ height: "1rem" }} />
                <FileUpload label="Upload Audio" onSelect={handleFileUpload} />
              </div>
            </Grid>

            <Grid item xs={12} md={8}>
              <SessionHistory items={history} />
            </Grid>
          </Grid>
        </Container>
      </div>
    </ThemeProvider>
  );
}
