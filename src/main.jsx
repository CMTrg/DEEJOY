import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme } from "./themes/theme.js";
import { lightTheme } from "./themes/theme.js";
import '@fontsource/outfit/300.css'; // Light
import '@fontsource/outfit/400.css'; // Regular
import '@fontsource/outfit/600.css'; // Semi-bold
import '@fontsource/outfit/700.css'; // Bold

import App from "./App.jsx";

import "./styles/base.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>
);
