import { Box } from "@mui/material";
import Navbar from "../../components/Navbar.jsx";
import AnimatedBackground from "../../components/AnimatedBackground.jsx";
import SearchBar from "./components/SearchBar.jsx";
import CategoryFilters from "./components/CategoryFilters.jsx";

export default function Home() {
  return (
    <Box sx={{ height: '120vh'}}>
    <AnimatedBackground />
    <Navbar />
    <Box
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/herobg.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'overlay',
          opacity: 0.75,
          zIndex: 1,
          mt: '58px',
          height: { xs: '250px', sm: '35vh' },

        }}
      />

      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          mt: '58px',
          height: { xs: '250px', sm: '35vh' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SearchBar></SearchBar>
        <CategoryFilters></CategoryFilters>
      </Box>

    </Box>
  );
}
