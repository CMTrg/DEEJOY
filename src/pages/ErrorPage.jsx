import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      <AnimatedBackground />

      <Box
        sx={{
          position: "relative",
          zIndex: 10,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "text.primary",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography variant="h1" sx={{ fontWeight: "bold", mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Sorry, the page you are looking for doesn’t exist or has been moved.
        </Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Go to Home
        </Button>
      </Box>
    </Box>
  );
}
