import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextareaAutosize,
  Typography,
  Autocomplete,
  TextField,
} from "@mui/material";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import CloseIcon from "@mui/icons-material/Close";
import api from "../api/api"; 

import { useLocation } from "../LocationContext"; 
import { useUser } from "../UserContext";

export default function BlogPostInput({onPostSuccess}) {
  const { lat, lng } = useLocation();
  const { token, user } = useUser();

  const [postText, setPostText] = useState("");
  const [images, setImages] = useState([]);
  const [rating, setRating] = useState(0);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locationInputValue, setLocationInputValue] = useState("");

  const debounceTimer = useRef(null);

  const handlePost = async () => {
    if (!postText.trim()) {
      alert("Please enter your review.");
      return;
    }
    if (!selectedLocation) {
      alert("Please select a location.");
      return;
    }
    if (images.length === 0) {
      alert("Please add at least one image.");
      return;
    }
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    try {
      if (!token || !user) {
        alert("You must be logged in to post a review.");
        return;
      }
      console.log(selectedLocation.id);

      const formData = new FormData();
      formData.append("fsqId", selectedLocation.id);
      formData.append("comment", postText);
      formData.append("rating", rating);

      images.forEach(({ file }) => {
        formData.append("images", file);
      });

      const res = await api.post("/reviews", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Review posted successfully:", res.data);

      setPostText("");
      setImages([]);
      setRating(0);
      setSelectedLocation(null);
      setLocationInputValue("");
      setShowLocationInput(false);
      if (onPostSuccess) {
        onPostSuccess(); 
      }
    } catch (err) {
      console.error("Failed to post review:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previewFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...previewFiles].slice(0, 5));
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRating = (newRating) => {
    setRating(newRating);
  };

  const handleLocationToggle = () => {
    setShowLocationInput(!showLocationInput);
    if (showLocationInput) {
      setLocationInputValue("");
      setLocationSuggestions([]);
      setSelectedLocation(null);
    }
  };

  const fetchLocationSuggestions = async (query) => {
    if (!query.trim() || lat == null || lng == null) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const res = await api.get("/destinations/autocomplete", {
        params: { query, lat, lng },
      });
      const results = Array.isArray(res.data) ? res.data : [];
      setLocationSuggestions(results);
    } catch (err) {
      console.error("Location search failed:", err);
      setLocationSuggestions([]);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchLocationSuggestions(locationInputValue);
    }, 500);

    return () => clearTimeout(debounceTimer.current);
  }, [locationInputValue, lat, lng]);

  useEffect(() => {
    if (selectedLocation) {
      setLocationInputValue(selectedLocation.name || "");
    }
  }, [selectedLocation]);

  return (
    <Box
      sx={{
        mt: 4,
        width: "80%",
        borderRadius: "20px",
        p: 2,
        backgroundColor: "blogbox.main",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        zIndex: 1000,
      }}
    >
      <TextareaAutosize
        value={postText}
        onChange={(e) => setPostText(e.target.value)}
        placeholder="Write your review here..."
        minRows={3}
        style={{
          padding: "12px",
          border: "none",
          fontSize: 16,
          resize: "none",
          outline: "none",
          color: "inherit",
          backgroundColor: "transparent",
        }}
      />

      {images.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {images.map((img, index) => (
            <Box
              key={index}
              sx={{
                position: "relative",
                width: 120,
                height: 90,
                borderRadius: 2,
                overflow: "hidden",
                border: "1px solid #ccc",
              }}
            >
              <img
                src={img.preview}
                alt={`Preview ${index}`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <IconButton
                size="small"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  color: "red",
                  backgroundColor: "rgba(255,255,255,0.7)",
                }}
                onClick={() => removeImage(index)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <IconButton component="label" color="primary">
          <AddPhotoAlternateOutlinedIcon />
          <input
            type="file"
            accept="image/*"
            hidden
            multiple
            onChange={handleImageUpload}
          />
        </IconButton>

        <IconButton color="primary" onClick={handleLocationToggle}>
          <LocationOnOutlinedIcon />
        </IconButton>

        <Button variant="outlined" color="primary" onClick={handlePost}>
          Post
        </Button>
      </Box>

      {showLocationInput && (
        <Autocomplete
          freeSolo
          options={locationSuggestions}
          getOptionLabel={(option) => option.name || ""}
          inputValue={locationInputValue}
          onInputChange={(event, newInputValue) => {
            setLocationInputValue(newInputValue);
          }}
          value={selectedLocation}
          onChange={(event, newValue) => {
            setSelectedLocation(newValue);
          }}
          renderInput={(params) => (
            <TextField {...params} label="Select Location" variant="outlined" />
          )}
          sx={{ mt: 1 }}
        />
      )}

      <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <IconButton
            key={star}
            onClick={() => handleRating(star)}
            color={rating >= star ? "warning" : "default"}
          >
            {rating >= star ? <StarIcon /> : <StarOutlineIcon />}
          </IconButton>
        ))}
      </Box>

      <Divider />
    </Box>
  );
}
