// src/components/Footer.jsx
import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "50px",
        backgroundColor: "#0B0148", // màu nền giống trong ảnh
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mt: 4,
        fontFamily: "'Outfit', sans-serif",
        fontSize: "0.875rem",
      }}
    >
      <Typography variant="body2" sx={{ml: "2.5%",}} >Copyright @2025</Typography>
      <Typography
        variant="body2"
        sx={{ mr: '2.5%', 
            cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
      >
        About us
      </Typography>
    </Box>
  );
}
