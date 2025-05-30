import { Box, Typography, Pagination } from "@mui/material";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";

export default function Favourite() {
  const [places, setPlaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const placesPerPage = 8;

  useEffect(() => {
    const target = document.getElementById("favourite-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `http://localhost:4000/api/destinations/explore/random?lat=${latitude}&lng=${longitude}`
          );
          console.log("API response:", res.data);

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
      }
    );
  }, []);

  const indexOfLastPlace = currentPage * placesPerPage;
  const indexOfFirstPlace = indexOfLastPlace - placesPerPage;
  const currentPlaces = places.slice(indexOfFirstPlace, indexOfLastPlace);
  const pageCount = Math.ceil(places.length / placesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <AnimatedBackground />

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

      <Footer />
    </Box>
  );
}
