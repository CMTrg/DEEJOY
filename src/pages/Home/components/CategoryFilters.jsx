import { Box, Button, MenuItem, Select, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const categories = [
  "Coffee & Drink",
  "Food & Restaurant",
  "Hotel",
  "Sport",
  "Entertainment",
  "Public",
];

export default function CategoryFilters() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [selected, setSelected] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: { xs: 0, sm: 2 },
        mt: 2,
        width: { xs: "70%", md: "50%" },
        maxWidth: "800px",
        mx: "auto",
      }}
    >
      {isMobile ? (
        <Select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          displayEmpty
          size="small"
          sx={{
            width: "70%",
            fontFamily: "Outfit",
            fontSize: "0.9rem",
            textTransform: "none",
            color: "text.primary",
            borderRadius: "10px",
            borderColor: "text.primary",
          }}
        >
          <MenuItem value="" disabled>
            Select Category
          </MenuItem>
          {categories.map((label) => (
            <MenuItem key={label} value={label}>
              {label}
            </MenuItem>
          ))}
        </Select>
      ) : (
        categories.map((label) => (
          <Button
            key={label}
            sx={{
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(4, 1, 54, 0.7)"
                  : "rgba(255, 255, 255, 0.7)",
              width: { sm: "9rem", md: "10.9375rem" },
              height: { sm: "2.5rem" },
              borderRadius: "10px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: { sm: "0.9rem", md: "1rem" },
              fontFamily: "Outfit",
              textTransform: "none",
              color: "text.primary",
              boxShadow: (theme) =>
                theme.palette.mode === "light"
                  ? "4px 4px 5.3px #A2A8FF"
                  : "4px 4px 5.3px #8727FC",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "#fff",
                borderColor: "primary.main",
              },
            }}
          >
            {label}
          </Button>
        ))
      )}
    </Box>
  );
}
