import React from "react";
import { Container } from "@mui/material";
import Navbar from "../components/Navbar";
import TaskRunner from "../components/TaskRunner/TaskRunner";

export default function StudioPage() {
  return (
    <div
      style={{
        background:
          "radial-gradient(circle at top, #0d1528 0%, #06080f 60%, #000 100%)",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Navbar />

      <Container maxWidth="md" sx={{ pt: 6 }}>
        <TaskRunner />
      </Container>
    </div>
  );
}
