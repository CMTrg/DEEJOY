import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import React from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { lightTheme, darkTheme } from "./themes/theme";
import { ThemeModeProvider, useThemeMode } from "./ThemeModeContext";

import '@fontsource/outfit/300.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';

import App from "./App.jsx";
import "./styles/base.css";

function Root() {
  const { resolvedMode } = useThemeMode();
  const theme = resolvedMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeModeProvider>
      <Root />
    </ThemeModeProvider>
  </StrictMode>
);
