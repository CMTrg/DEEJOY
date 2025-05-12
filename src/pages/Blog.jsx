import React from "react";
import { Box, Button } from "@mui/material";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import BlogPostInput from "../components/BlogPostInput";
import SamplePostList from "../components/SamplePostList";


function Blog() {
  return (
    <Box
      sx={{
        mt: "80px",
        width: "100%",
        height: '100vh',
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
        <AnimatedBackground></AnimatedBackground>
        <Navbar></Navbar>
        <BlogPostInput></BlogPostInput>
        <SamplePostList></SamplePostList>
        <SamplePostList></SamplePostList>
        <SamplePostList></SamplePostList>
        
      <Footer sx={{ position: "relative"}}></Footer>
    </Box>
  );
}

export default Blog;
