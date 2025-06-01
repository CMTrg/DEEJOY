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
import { useState, useEffect, useRef } from "react";
import { useUser } from "../UserContext";  
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";
import api from "../api/api";

export default function Settings() {
  const theme = useTheme();
  const fileInputRef = useRef(null);
  const { user, fetchUser } = useUser();  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showHelp, setShowHelp] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Sync form with user data when user changes
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
      }));
      setPreviewImage(null); // reset preview to show updated profile picture
    }
  }, [user]);

  const handleInputChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (form.password && form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!user) {
      alert("User not authenticated.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", form.username);
      formData.append("email", form.email);
      if (form.password) formData.append("password", form.password);
      if (fileInputRef.current?.files[0]) {
        formData.append("profilePicture", fileInputRef.current.files[0]);
      }

      await api.put(`/users/update/${user._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Settings updated!");
      setPreviewImage(null);
      fetchUser();  // <-- update global user state after successful update
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
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
                src={previewImage || user?.profilePicture || "/avatar.jpg"}
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={() => setShowHelp(false)}
                sx={{ fontWeight: 600, width: "100px" }}
              >
                General settings
              </Button>
              <Button
                variant="contained"
                onClick={() => setShowHelp(true)}
                sx={{ fontWeight: 600, width: "100px" }}
              >
                Help
              </Button>
            </Box>
          </Box>

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
                <Typography variant="h5" fontWeight="bold" mb={3}>
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
                  <Typography
                    color="error"
                    sx={{ cursor: "pointer" }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload image
                  </Typography>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }}
                  />

                  <Avatar
                    src={previewImage || user?.profilePicture || "/avatar.jpg"}
                    sx={{ width: 56, height: 56 }}
                  />
                </Box>

                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={form.username}
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

                {user?.googleId ? (
                  <Typography sx={{ mt: 2 }} color="text.secondary">
                    You registered via Google. Password cannot be changed here.
                  </Typography>
                ) : (
                  <>
                    <TextField
                      fullWidth
                      label="New Password"
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                    <TextField
                      fullWidth
                      label="Confirm New Password"
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleInputChange}
                      margin="normal"
                    />
                  </>
                )}

                <Divider sx={{ my: 3 }} />

                <Box mt={4} textAlign="center">
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{
                      px: 4,
                      py: 1.2,
                      fontWeight: 700,
                      borderRadius: 2,
                    }}
                  >
                    SAVE
                  </Button>
                </Box>
              </>
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center", px: 2 }}>
                If you need any help, please contact us through @support
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}
