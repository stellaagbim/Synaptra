import React, { useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { motion } from "framer-motion";

import theme from "./theme";
import Navbar from "./components/Navbar";
import TaskRunner from "./components/TaskRunner/TaskRunner";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import AutomationsPage from "./pages/AutomationsPage";
import MemoryPage from "./pages/MemoryPage";
import ToolsPage from "./pages/ToolsPage";
import HistoryPage from "./pages/HistoryPage";
import SettingsPage from "./pages/SettingsPage";

export default function App() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "tasks":
        return <TaskRunner />;
      case "automations":
        return <AutomationsPage />;
      case "memory":
        return <MemoryPage />;
      case "tools":
        return <ToolsPage />;
      case "history":
        return <HistoryPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <Dashboard />;
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
          display: "flex",
          overflow: "hidden",
          color: "white",
        }}
      >
        {/* Sidebar */}
        <Sidebar active={activeSection} onChange={setActiveSection} />

        {/* Main content area */}
        <div className="flex min-h-screen flex-1 flex-col">
          {/* Top navbar */}
          <Navbar />

          {/* Animated page content */}
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 pb-8 pt-4 overflow-y-auto"
          >
            {renderSection()}
          </motion.main>
        </div>
      </div>
    </ThemeProvider>
  );
}
