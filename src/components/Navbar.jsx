import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
  useTheme,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ThemeModeSelect from "../ThemeModeContext";
import { useUser } from "../UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/icon2.svg";
import api from "../api/api";

export default function Navbar() {
  const theme = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const { user, fetchUser, handleLogout: contextLogout } = useUser();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await api.post(
          "/users/logout",
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      localStorage.removeItem("token");
      contextLogout();
      handleMenuClose();
      navigate("/auth");
    } catch (error) {
      console.error("Error during logout:", error.message);
      localStorage.removeItem("token");
      contextLogout();
      navigate("/auth");
    }
  };

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getAvatarSrc = () => {
    if (!user?.profilePicture) return undefined;
    return user.profilePicture.startsWith("http")
      ? user.profilePicture
      : `http://localhost:4000/${user.profilePicture}`;
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor:
          theme.palette.mode === "dark"
            ? "rgba(11,1,72,0.3)"
            : "rgba(177,191,255,0.5)",
        backdropFilter: "blur(10px)",
        zIndex: 1100,
        height: "58px",
        boxShadow:
          theme.palette.mode === "dark"
            ? "0px 1.25px 12.5px rgba(41, 10, 140, 1)"
            : "0px 5px 12.5px rgba(179, 194, 255, 0.4)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="logo"
            style={{ width: "40px", height: "auto" }}
          />
          <Typography
            variant="h5"
            fontWeight="bold"
            color="text.primary"
            component={Link}
            to="/"
            sx={{
              ml: "2.5px",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "0.2rem",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            DEEJOY
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            paddingRight: "0.5%",
          }}
        >
          <Box sx={{ display: { xs: "none", sm: "flex" }, gap: "10px" }}>
            <Button component={Link} to="/" sx={{ color: "text.primary" }}>
              Home
            </Button>
            <Button component={Link} to="/favourite" sx={{ color: "text.primary" }}>
              Favourite
            </Button>
            <Button component={Link} to="/blog" sx={{ color: "text.primary" }}>
              Blog
            </Button>
            <Button component={Link} to="/about" sx={{ color: "text.primary" }}>
              About
            </Button>
            {!user && (
              <Button component={Link} to="/auth" sx={{ color: "text.primary" }}>
                Auth
              </Button>
            )}
          </Box>

          <ThemeModeSelect />

          <Box>
            <Avatar
              src={getAvatarSrc()}
              alt={user?.username || "Guest"}
              sx={{
                width: 32,
                height: 32,
                bgcolor: getAvatarSrc() ? "transparent" : "gray",
                fontSize: 14,
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={(event) => {
                if (user) {
                  setAnchorEl(event.currentTarget);
                } else {
                  navigate("/auth");
                }
              }}
            >

              {!getAvatarSrc() && (user?.username?.[0]?.toUpperCase() || "G")}
            </Avatar>

            {user && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    borderRadius: 2,
                    minWidth: 180,
                    mt: 1,
                    boxShadow:
                      theme.palette.mode === "dark"
                        ? "0 4px 20px rgba(0,0,0,0.5)"
                        : "0 4px 20px rgba(0,0,0,0.1)",
                    backgroundColor:
                      theme.palette.mode === "dark"
                        ? "rgba(30, 30, 60, 0.95)"
                        : "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(8px)",
                  },
                }}
              >
                <MenuItem
                  onClick={handleMenuClose}
                  component={Link}
                  to="/settings"
                  sx={{ gap: 1.5, py: 1.2 }}
                >
                  <SettingsIcon fontSize="small" />
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogout} sx={{ gap: 1.5, py: 1.2 }}>
                  <LogoutIcon fontSize="small" />
                  Logout
                </MenuItem>
              </Menu>
            )}
          </Box>

          <IconButton
            edge="end"
            onClick={() => setOpen(true)}
            sx={{
              display: { xs: "flex", sm: "none" },
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>

          <Drawer
            anchor="right"
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
              sx: {
                backgroundColor: theme.palette.background.default,
                color: theme.palette.text.primary,
                width: 200,
              },
            }}
          >
            <List>
              {[
                { text: "Home", path: "/" },
                { text: "Favourite", path: "/favourite" },
                { text: "Blog", path: "/blog" },
                { text: "About", path: "/about" },
                ...(user
                  ? [
                      { text: "Settings", path: "/settings" },
                      { text: "Logout", action: handleLogout },
                    ]
                  : [{ text: "Auth", path: "/auth" }]),
              ].map(({ text, path, action }) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    component={path ? Link : "button"}
                    to={path}
                    onClick={() => {
                      if (action) action();
                      setOpen(false);
                    }}
                  >
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
