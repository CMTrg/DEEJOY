import {
    Box,
    Typography,
    Avatar,
    TextField,
    Button,
    Divider,
    Paper,
  } from "@mui/material";
  import { useTheme } from "@mui/material/styles";
  import { useState } from "react";
  import Navbar from "../components/Navbar";
  import Footer from "../components/Footer";
  import AnimatedBackground from "../components/AnimatedBackground";
  
  export default function Settings() {
    const theme = useTheme();
    const [form, setForm] = useState({
      name: "",
      email: "",
      phone: "",
    });
    const [showHelp, setShowHelp] = useState(false);
  
    const handleInputChange = (e) => {
      setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };
  
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AnimatedBackground />
        <Navbar />
  
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "center",
            px: { xs: 2, sm: 4 },
            py: 4,
            pt: 10,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: "1100px",
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Sidebar */}
            <Box sx={{ width: { xs: "100%", md: "250px" } }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  src="/avatar.jpg"
                  sx={{ width: 100, height: 100, mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={() => setShowHelp(false)}
                  sx={{ fontWeight: 600, color: "primary.text", width: "100px" }}
                >
                  General settings
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setShowHelp(true)}
                  sx={{ fontWeight: 600, color: "primary.text", width: "100px" }}
                >
                  Help
                </Button>
              </Box>
            </Box>
  
            {/* Main Content */}
            <Paper
              elevation={4}
              sx={{
                flex: 1,
                borderRadius: 3,
                px: { xs: 3, sm: 6 },
                py: 4,
                backdropFilter: "blur(10px)",
                border: `1px solid ${theme.palette.divider}`,
                backgroundColor: theme.palette.background.paper,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {!showHelp ? (
                <>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    mb={3}
                    color="text.primary"
                  >
                    Account Settings
                  </Typography>
  
                  <Typography variant="subtitle1" mb={1}>
                    Profile picture
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 3,
                      gap: 2,
                    }}
                  >
                    <Avatar sx={{ width: 56, height: 56 }} />
                    <Typography color="error" sx={{ cursor: "pointer" }}>
                      Upload image
                    </Typography>
                  </Box>
  
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Email address"
                    name="email"
                    value={form.email}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Phone number"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    margin="normal"
                  />
  
                  <Divider sx={{ my: 3 }} />
  
                  <Box mt={4} textAlign="center">
                    <Button
                      variant="contained"
                      sx={{ px: 4, py: 1.2, fontWeight: 700, borderRadius: 2 }}
                    >
                      SAVE
                    </Button>
                  </Box>
                </>
              ) : (
                <Typography
                  variant="h6"
                  color="text.primary"
                  sx={{ fontFamily: "Outfit", textAlign: "center", px: 2 }}
                >
                  If you need any help please contact us through @
                </Typography>
              )}
            </Paper>
          </Box>
        </Box>
  
        <Footer />
      </Box>
    );
  }
  