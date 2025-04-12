import { Box, Typography, Pagination } from "@mui/material";
import Navbar from "../../components/Navbar.jsx";
import AnimatedBackground from "../../components/AnimatedBackground.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CategoryFilters from "./components/CategoryFilters.jsx";
import PlaceCard from "../../components/PlaceCard.jsx";
import Footer from "../../components/Footer.jsx";
export default function Home() {
  return (
    <Box>
      <AnimatedBackground />
      <Navbar />
      <Box sx={{
        position: 'relative' //Box này chứa Overlay -> set relative để box dưới absolute theo
      }}>
        <Box    //Box này chứa ảnh
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

      <Box //Box này chứa content overlay lên
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
          <SearchBar></SearchBar>
          <CategoryFilters></CategoryFilters>
        </Box>
      </Box>
      
        {/*contain title and card */}
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
      </Box>
      <Footer></Footer>
    </Box>
  );
}
