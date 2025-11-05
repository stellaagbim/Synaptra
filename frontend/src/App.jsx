import React from "react";
import Navbar from "./components/Navbar";
import FileUpload from "./components/FileUpload";
import LatencyCard from "./components/LatencyCard";
import SessionHistory from "./components/SessionHistory";
import Footer from "./components/Footer";
import { motion } from "framer-motion";

export default function App() {
  return (
    <motion.div
      className="min-h-screen flex flex-col bg-gradient-to-b from-[#060913] via-[#0b0f1a] to-[#101624] text-white overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* NAVBAR */}
      <header className="fixed top-0 w-full z-50 backdrop-blur-lg bg-[#0b0f1a]/60 border-b border-white/10 shadow-md">
        <Navbar />
      </header>

      {/* MAIN */}
      <main className="flex flex-col items-center justify-center flex-grow px-6 md:px-12 pt-40 pb-28 space-y-12">
        {/* HERO TITLE */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#5ee7ff] via-[#00c6ff] to-[#7c3aed] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(94,231,255,0.45)]">
            Synaptra Core v3.0
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Multimodal Embodied AI Agent — bridging Vision, Audio, Reasoning & Action.
          </p>
        </div>

        {/* UPLOAD SECTION */}
        <div className="flex flex-wrap justify-center gap-6">
          <FileUpload />
          <FileUpload />
        </div>

        {/* LATENCY CARD */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
        >
          <LatencyCard latency={84} />
        </motion.div>

        {/* SESSION HISTORY */}
        <motion.section
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.7 }}
          className="w-full max-w-3xl"
        >
          <SessionHistory />
        </motion.section>
      </main>

      {/* FOOTER */}
      <Footer />
    </motion.div>
  );
}
