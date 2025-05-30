import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import api from "../api/api";
import PlaceCard from "../components/PlaceCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    destinationId: null,
  });

  const token = localStorage.getItem("token");

  const fetchFavorites = async () => {
    if (!token) return;
    try {
      const res = await api.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveRequest = (destinationId) => {
    setConfirmDialog({ open: true, destinationId });
  };

  const handleConfirmRemove = async () => {
    try {
      await api.delete("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
        data: { destinationId: confirmDialog.destinationId },
      });
      setConfirmDialog({ open: false, destinationId: null });
      fetchFavorites();
    } catch (err) {
      console.error("Failed to remove favorite:", err);
    }
  };

  const handleCancelRemove = () => {
    setConfirmDialog({ open: false, destinationId: null });
  };

  return (
    <Box
      sx={{
        mt: "58px",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />
    <Box>
      <AnimatedBackground />
      <Navbar />

      <Box sx={{ flexGrow: 1 }}>
        <Box
          id="favourite-section"
          sx={{
            scrollMarginTop: "70px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
            gap: 1,
            mb: 6, // margin bottom cho pagination + padding
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="text.primary"
            sx={{
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: "0.2rem",
              mt: "1rem",
            }}
          >
            FAVOURITE
          </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          gap: 1,
          mb: 20,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="text.primary"
          sx={{
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.2rem",
            mt: "6rem",
            mb: 2,
          }}
        >
          Your Favorite Places
        </Typography>

          {currentPlaces.length > 0 ? (
            <Box
              sx={{
                width: { md: "80%", xs: "100%" },
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  md: "repeat(4, 1fr)",
                },
                gap: "20px",
                justifyItems: "center",
                p: 1,
              }}
            >
              {currentPlaces.map((place) => (
                <PlaceCard
                  key={place._id || place.foursquareId}
                  image={place.images?.[0]}
                  title={place.name}
                  address={place.address || "Address unavailable"}
                  rating={place.rating || 0}
                  description={`Category: ${place.category || "Unknown"}`}
                  likes={place.favoritesCount || "0"}
                  shares={place.sharedCount || "0"}
                  comments={place.reviewCount || "0"}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                minHeight: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 1,
              }}
            >
              <CircularProgress size={48} thickness={4} color="primary" />
            </Box>
          )}

          {pageCount > 1 && (
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              color="secondary"
              sx={{ mt: 2 }}
            />
          )}
        </Box>
      </Box>

        {!token ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            Please log in to view your favorite places.
          </Typography>
        ) : favorites.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            You don't have any favorites yet.
          </Typography>
        ) : (
          <Box
            sx={{
              width: { md: "80%", xs: "100%" },
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: "20px",
              justifyItems: "center",
              p: 1,
            }}
          >
            {favorites.map((fav) => (
              <PlaceCard
                key={fav.destinationId._id}
                destinationId={fav.destinationId._id}
                userId={fav.userId}
                image={fav.destinationId.images?.[0]}
                title={fav.destinationId.name}
                address={fav.destinationId.address || "Address unavailable"}
                rating={fav.destinationId.rating || 0}
                description={`Category: ${
                  fav.destinationId.category || "Unknown"
                }`}
                shares={fav.destinationId.sharedCount || "0"}
                comments={fav.destinationId.reviewCount || "0"}
                initialLikes={fav.destinationId.favoritesCount || "0"}
                onAttemptRemove={() => handleRemoveRequest(fav.destinationId._id)}
              />
            ))}
          </Box>
        )}
      </Box>

      <Dialog open={confirmDialog.open} onClose={handleCancelRemove}>
        <DialogTitle>
          Are you sure you want to remove this from favorites?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelRemove} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmRemove} color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </Box>
  );
}
