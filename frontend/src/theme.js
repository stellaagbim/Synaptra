import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#5ee7ff" },
    secondary: { main: "#7c3aed" },
    background: {
      default: "#0b0f1a",
      paper: "rgba(255,255,255,0.06)",
    },
    divider: "rgba(255,255,255,0.12)",
    text: {
      primary: "rgba(255,255,255,0.92)",
      secondary: "rgba(255,255,255,0.72)",
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily:
      "'Inter Variable', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto",
    h1: { fontWeight: 900, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 700, letterSpacing: ".2px" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background:
            "radial-gradient(circle at top, #0d1528 0%, #06080f 60%, #000 100%)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.10)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
