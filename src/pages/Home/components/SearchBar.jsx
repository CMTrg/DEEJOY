import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import axios from "axios";

export default function SearchBar({ onSearch, lat, lng }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2 || lat === null || lng === null) return;
      try {
        const res = await axios.get(
          `http://localhost:4000/api/destinations/autocomplete`, {
            params: {
              query: searchTerm,
              lat: lat,
              lng: lng
            }
          }
        );
        if (Array.isArray(res.data)) {
          setSuggestions(res.data); 
        } else {
          console.warn("Unexpected autocomplete structure:", res.data);
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, lat, lng]); 

  const handleSearch = async (value = searchTerm) => {
    if (!value.trim() || lat === null || lng === null) {
      alert("Waiting for location... Please try again in a moment.");
      return;
    }

    if (onSearch) {
      onSearch(value.trim());
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: "70%", md: "50%" },
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(4, 1, 54, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
        borderRadius: "10px",
        px: 2,
        py: 1,
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "4px 4px 5.3px #A2A8FF"
            : "4px 4px 5.3px #8727FC",
        mb: 2,
      }}
    >
      <Autocomplete
        freeSolo
        options={suggestions}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option?.name || ""
        }
        onInputChange={(e, val) => setSearchTerm(val)}
        onChange={(e, val) => {
          if (typeof val === "string") {
            handleSearch(val);
          } else if (val?.name) {
            handleSearch(val.name);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            placeholder="Search for places here..."
            onKeyDown={handleKeyDown}
            sx={{
              flexGrow: 1,
              fontFamily: "Outfit",
              fontSize: "1rem",
              input: { color: "text.primary" },
            }}
          />
        )}
        sx={{ flexGrow: 1 }}
      />

      <IconButton sx={{ ml: 1 }} onClick={() => handleSearch()}>
        <SearchIcon />
      </IconButton>

      <Box sx={{ ml: 1 }}>
        <Button
          variant="outlined"
          size="small"
          disableElevation
          disableRipple
          sx={{
            minWidth: "auto",
            width: "36px",
            height: "36px",
            padding: 0,
            borderRadius: "999px",
            textTransform: "none",
            color: "text.primary",
            borderColor: "text.primary",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "#fff",
              borderColor: "primary.main",
            },
          }}
        >
          <PlaceIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}
