import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import LatencyCard from "./components/LatencyCard";
import SessionHistory from "./components/SessionHistory";
import Footer from "./components/Footer";
import { sendCommand, uploadFile } from "./api";

export default function App() {
  const [latency, setLatency] = useState(0);
  const [history, setHistory] = useState([]);

  // ──────────────── Handlers ────────────────
  const handleFile = async (file) => {
    try {
      const res = await uploadFile(file);
      setLatency(res.latency);
      setHistory((prev) => [
        { kind: res.type.split("/")[0], content: res.message },
        ...prev,
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleText = async (e) => {
    e.preventDefault();
    const prompt = e.target.prompt.value.trim();
    if (!prompt) return;
    e.target.reset();
    try {
      const res = await sendCommand(prompt);
      setLatency(res.latency);
      setHistory((prev) => [
        { kind: "text", content: res.response },
        ...prev,
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // ──────────────── UI ────────────────
  return (
    <div className="app-shell">
      <div className="decals" />
      <Navbar />

      <section className="hero">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Synaptra Core v3.0
        </motion.h1>

        <motion.p
          className="subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          Multimodal Intelligence Interface — process text, image, and audio through one unified agent pipeline.
        </motion.p>
      </section>

      <section className="actions">
        <FileUpload label="Upload Image or Audio" onSelect={handleFile} />
        <LatencyCard latency={latency} />
      </section>

      <form onSubmit={handleText} className="cmd-wrap">
        <input
          name="prompt"
          placeholder="Enter command (e.g., run print(2+2))"
          className="cmd"
        />
        <button type="submit" className="send">
          Send
        </button>
      </form>

      <SessionHistory items={history} />
      <Footer />
    </div>
  );
}
