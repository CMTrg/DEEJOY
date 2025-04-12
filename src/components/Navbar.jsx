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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ThemeModeSelect from "../ThemeModeContext";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const theme = useTheme();
  const [open, setOpen] = useState(false);

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
        <Typography
          variant="h5"
          fontWeight="bold"
          color="text.primary"
          component={Link}
          to="/"
          sx={{
            ml: "2.5%",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.2rem",
            cursor: "pointer",
            textDecoration: "none",
          }}
        >
          DEEJOY
        </Typography>

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
            <Button
              component={Link}
              to="/favourite"
              sx={{ color: "text.primary" }}
            >
              Favourite
            </Button>
            <Button sx={{ color: "text.primary" }}>Blog</Button>
            <Button sx={{ color: "text.primary" }}>About</Button>
          </Box>

          <ThemeModeSelect />
          <Avatar
            src=""
            alt="User Avatar"
            sx={{
              width: 32,
              height: 32,
              bgcolor: "beige",
              fontSize: 14,
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            U
          </Avatar>

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
                { text: "Blog", path: "/" },
                { text: "About", path: "/" },
              ].map(({ text, path }) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={path}
                    onClick={() => setOpen(false)}
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
