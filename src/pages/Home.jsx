import { 
  Box,
  Typography,
  Pagination,
  CircularProgress
} from "@mui/material";
import Navbar from "../components/Navbar.jsx";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import SearchBar from "./Home/components/SearchBar.jsx";
import CategoryFilters from "./Home/components/CategoryFilters.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import api from "../api/api";
import { useLocation } from "../LocationContext";

export default function Home() {
  const { lat: contextLat, lng: contextLng } = useLocation();
  const [manualLatLng, setManualLatLng] = useState(null);
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const placesPerPage = 8;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [likedState, setLikedState] = useState({});


  const lat = manualLatLng?.lat ?? contextLat;
  const lng = manualLatLng?.lng ?? contextLng;

  useEffect(() => {
    if (lat !== null && lng !== null) {
      const fetchDestinations = async () => {
        try {
          const res = await api.get("/destinations/explore/random", {
            params: { lat, lng },
          });
          if (res.data?.places) {
            const uniquePlaces = Array.from(
              new Map(res.data.places.map(p => [(p._id || p.foursquareId), p])).values()
            );
            setPlaces(uniquePlaces);
          } else {
            console.warn("Unexpected API structure", res.data);
          }
        } catch (err) {
          console.error("Failed to fetch destinations", err);
        }
      };
      fetchDestinations();
    }
  }, [lat, lng]);

  const handleSearch = async (searchTerm) => {
    const trimmed = searchTerm.trim();

    if (!trimmed) {

      try {
        const res = await api.get("/destinations/explore/random", {
          params: { lat, lng },
        });
        const uniquePlaces = Array.from(
          new Map(res.data.places.map(p => [(p._id || p.foursquareId), p])).values()
        );
        setPlaces(uniquePlaces);
        setCurrentPage(1);
      } catch (err) {
        console.error("Random fetch failed:", err);
      }
      return;
    }

    // Normal search
    try {
      const res = await api.get("/destinations/search", {
        params: { query: trimmed, lat, lng },
      });
      const uniquePlaces = Array.from(
        new Map(res.data.map(p => [(p._id || p.foursquareId), p])).values()
      );
      setPlaces(uniquePlaces);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  const handleCategorySelect = async (category) => {
    if (lat === null || lng === null) {
      alert("Please provide a location.");
      return;
    }

    try {
      const res = await api.get(`/destinations/explore/category/${encodeURIComponent(category)}`, {
        params: { lat, lng },
      });
      if (res.data?.places) {
        const uniquePlaces = Array.from(
          new Map(res.data.places.map(p => [(p._id || p.foursquareId), p])).values()
        );
        setPlaces(uniquePlaces);
        setCurrentPage(1);
        setSelectedCategory(category);
      } else {
        console.warn("Unexpected category response", res.data);
      }
    } catch (err) {
      console.error("Failed to fetch by category", err);
    }
  };

  const handleToggleLike = (destinationId, isLiked) => {
    setLikedState((prev) => ({
      ...prev,
      [destinationId]: {
        liked: !isLiked,
        count: (prev[destinationId]?.count || 0) + (isLiked ? -1 : 1),
      },
    }));
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
            position: "relative",
            zIndex: 2,
            mt: "58px",
            height: { xs: "250px", sm: "35vh" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SearchBar lat={lat} lng={lng} setLatLng={setManualLatLng} onSearch={handleSearch} />
          <CategoryFilters onCategorySelect={handleCategorySelect} />
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mb: 20,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mt: "1rem",
            fontFamily: "'Outfit', sans-serif",
            letterSpacing: "0.2rem",
          }}
        >
          {selectedCategory?.toUpperCase() || "RANDOM"}
        </Typography>


        {places.length === 0 ? (
          <Box
            sx={{
              width: "100%",
              minHeight: "60vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <CircularProgress color="primary" size={48} thickness={4} />
            <Typography variant="body1" sx={{ fontStyle: "italic" }}>
              {lat == null || lng == null
                ? "Please wait while we locate your position..."
                : "Fetching destinations..."}
            </Typography>
          </Box>
        ) : (
          <>
            {/* Grid */}
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
                  destinationId={place._id}
                  image={place.images?.[0]}
                  title={place.name}
                  address={place.address || "Address unavailable"}
                  rating={place.rating || 0}
                  description={`Category: ${place.category || "Unknown"}`}
                  likes={
                    likedState[place._id || place.foursquareId]?.count ??
                    place.favoritesCount ??
                    "0"
                  }
                  shares={place.sharedCount || "0"}
                  comments={place.reviewCount || "0"}
                  isLiked={likedState[place._id || place.foursquareId]?.liked ?? false}
                  onToggleLike={() =>
                    handleToggleLike(
                      place._id || place.foursquareId,
                      likedState[place._id || place.foursquareId]?.liked ?? false
                    )
                  }
                  onClick={handlePlaceClick}
                />
              ))}
            </Box>

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
          </>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
