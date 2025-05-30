import { Box, Typography, Paper } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

export default function About() {
  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <AnimatedBackground />
      <Navbar />

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          px: { xs: 2, sm: 4 },
          py: 8,
          pt: 10,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            maxWidth: "900px",
            px: { xs: 3, sm: 6 },
            py: 5,
            borderRadius: 4,
            backgroundColor: (theme) => theme.palette.background.paper,
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            About Us
          </Typography>

          <Typography variant="body1" sx={{ mt: 2, fontSize: "1.1rem" }}>
            This project was built to inspire exploration and discovery of amazing places nearby.
            We aim to help users find hidden gems and must-visit destinations, powered by real-time
            geolocation and smart filtering.
          </Typography>


          <Typography variant="body1" sx={{ mt: 2, fontSize: "1.1rem" }}>
            Built with React, Node.js, MongoDB and the Foursquare API.
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" fontWeight="bold">
              Contact Us
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              Reach out through ig: @mtrg_cmt
            </Typography>
          </Box>
        </Paper>
      </Box>

      <Footer />
    </Box>
  );
}
