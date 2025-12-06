import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // 👇 this is IMPORTANT for GitHub Pages
  base: "/Synaptra/",
});
