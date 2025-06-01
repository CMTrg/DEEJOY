import { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  Button,
  Autocomplete,
  TextField,
  Popover,
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";
import axios from "axios";
import { useLocation } from "../../../LocationContext";


export default function SearchBar({ onSearch }) {
  const { lat, lng, updateManualLocation } = useLocation(); 

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [distance, setDistance] = useState("<10km");
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim().length < 2 || lat === null || lng === null) return;
      try {
        const res = await axios.get("http://localhost:4000/api/destinations/autocomplete", {
          params: { query: searchTerm, lat, lng },
        });
        setSuggestions(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Autocomplete fetch failed:", err);
        setSuggestions([]);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, lat, lng]);

  const handleSearch = async (value = searchTerm) => {
    if (lat === null || lng === null) {
      alert("Waiting for location... Please try again in a moment.");
      return;
    }

    const trimmed = value.trim();

    if (!trimmed) {
      if (onSearch) onSearch(""); 
    } else {
      if (onSearch) onSearch(trimmed);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClick = async (event) => {
    setAnchorEl(event.currentTarget);
    if (location.trim().length < 2) return;

    try {
      const res = await axios.get("http://localhost:4000/api/geolocation", {
        params: { q: location.trim() },
      });

      if (res.data && res.data.lat && res.data.lng) {
        updateManualLocation({ lat: res.data.lat, lng: res.data.lng }); 
      } else {
        alert("Could not find location.");
      }
    } catch (err) {
      console.error("Location geocoding failed:", err);
      alert("Error fetching geolocation.");
    }
  };

  const handleClose = () => setAnchorEl(null);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleDistanceChange = (e) => setDistance(e.target.value);

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
          if (typeof val === "string") handleSearch(val);
          else if (val?.name) handleSearch(val.name);
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
          onClick={handleClick}
        >
          <PlaceIcon fontSize="small" />
        </Button>
      </Box>

      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Box sx={{ padding: 2, width: 250 }}>
          <TextField
            fullWidth
            label="Where are you at?"
            variant="outlined"
            value={location}
            onChange={handleLocationChange}
            size="small"
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Distance</InputLabel>
            <Select
              value={distance}
              label="Distance"
              onChange={handleDistanceChange}
              size="small"
            >
              <SelectMenuItem value="<10km">Less than 10 km</SelectMenuItem>
              <SelectMenuItem value="<5km">Less than 5 km</SelectMenuItem>
              <SelectMenuItem value="<1km">Less than 1 km</SelectMenuItem>
            </Select>
          </FormControl>
        </Box>
      </Popover>
    </Box>
  );
}
