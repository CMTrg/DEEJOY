import React, { useState } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import BlogPostInput from "../components/BlogPostInput";
import SamplePostList from "../components/SamplePostList";

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);

  return (
    <Box
      sx={{
        mt: "80px",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <AnimatedBackground />
      <Navbar />
      <BlogPostInput />
      <SamplePostList selectedPost={selectedPost} setSelectedPost={setSelectedPost} />
      <Footer sx={{ position: "relative" }} />
    </Box>
  );
}

export default Blog;
