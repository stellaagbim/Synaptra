// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#00E5FF" },
    secondary: { main: "#8B5CF6" },
    background: {
      default: "#050A1F",
      paper: "rgba(255,255,255,0.05)",
    },
    divider: "rgba(255,255,255,0.12)",
    text: {
      primary: "#E5E7EB",
      secondary: "#9CA3AF",
    },
  },
  typography: {
    fontFamily:
      "'Inter Variable', 'Segoe UI', system-ui, -apple-system, Roboto, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700 },
    h6: { fontWeight: 500 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: "linear-gradient(90deg,#00E5FF,#8B5CF6)",
          color: "#fff",
          "&:hover": {
            opacity: 0.9,
            boxShadow: "0 0 20px rgba(139,92,246,0.5)",
          },
        },
      },
    },
  },
});

export default theme;
