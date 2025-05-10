import { Box, Typography, Pagination } from "@mui/material";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground.jsx";
import PlaceCard from "../components/PlaceCard.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect } from "react";



export default function Favourite() {
  return (
    useEffect(() => {
        const target = document.getElementById("favourite-section");
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }, []), 

    <Box  sx={{ mt: "80px"}}>
        <Navbar></Navbar>
        <AnimatedBackground></AnimatedBackground>
          {/*contain title and card */}
          <Box
          id='favourite-section'
          
          sx={{
            scrollMarginTop: '70px',
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
            FAVOURITE
          </Typography>
          <Box
            sx={{
              width: { md: "80%", xs: "100%" },
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)", // mobile: 2 cột
                md: "repeat(4, 1fr)", // desktop: 4 cột
              },
              gap: "20px",
              justifyItems: "center", // căn giữa card trong ô
              p: 1,
            }}
          >
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
            <PlaceCard
              image="/testcard.jpg"
              title="Movie Theatre"
              address="123, bcd street, hcm city"
              rating={5.4}
              description="abcdxyzjajdj, wadjwpojfpafpppfpa."
              likes="20k"
              shares="34"
              comments="30"
            />
          </Box>
         <Pagination count={10} /* variant="outlined" */ shape="rounded" color="secondary" sx={{
            mt: 2,
         }}></Pagination>
        </Box>
        <Footer></Footer>
    </Box>
  );
}
