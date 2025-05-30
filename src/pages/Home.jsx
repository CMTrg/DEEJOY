import { Box, Typography, Pagination, CircularProgress } from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import SearchBar from "./Home/components/SearchBar.jsx";
import CategoryFilters from "./Home/components/CategoryFilters.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import Footer from "../components/Footer.jsx";
import PlaceDetail from "../components/PlaceDetailOverlay.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const placesPerPage = 8;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLat(latitude);
        setLng(longitude);

        try {
          const res = await axios.get(
            `http://localhost:4000/api/destinations/explore/random?lat=${latitude}&lng=${longitude}`
          );
          if (res.data?.places) {
            setPlaces(res.data.places);
          } else {
            console.warn("Unexpected API structure", res.data);
          }
        } catch (err) {
          console.error("Failed to fetch destinations", err);
        }
      },
      (err) => {
        console.error("Location access denied:", err);
        alert("Location access is needed for better recommendations.");
      }
    );
  }, []);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;

    if (lat === null || lng === null) {
      alert("Waiting for location... Please try again in a moment.");
      return;
    }

    try {
      const res = await axios.get(
        "http://localhost:4000/api/destinations/search",
        {
          params: {
            query: searchTerm,
            lat,
            lng,
          },
        }
      );

      setPlaces(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);
  const pageCount = Math.ceil(places.length / placesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceClick = (placeData) => {
    setSelectedPlace(placeData);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AnimatedBackground />
      <Navbar />
      <Box sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage: "url('/herobg.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              mixBlendMode: "overlay",
              opacity: 0.75,
              zIndex: 1,
              mt: "58px",
              height: { xs: "250px", sm: "35vh" },
            }}
          />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                zIndex: 2,
                mt: "58px",
                height: { xs: "250px", sm: "35vh" },
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SearchBar onSearch={handleSearch} lat={lat} lng={lng} />
              <CategoryFilters />
            </Box>
          </Box>
        </Box>

        {/* Main Content */}
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
              mt: "1rem",
            }}
          >
            RANDOM
          </Typography>

          {/* Overlay Detail */}
          {selectedPlace && (
            <PlaceDetail
              open={Boolean(selectedPlace)}
              data={selectedPlace}
              onClose={() => setSelectedPlace(null)}
            />
          )}

          {/* Grid of Places */}
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
                  onClick={handlePlaceClick}
                />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                width: "100%",
                minHeight: "60vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress color="primary" size={48} thickness={4} />
            </Box>
          )}

          {/* Pagination */}
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

      <Footer />
    </Box>
  );
}
