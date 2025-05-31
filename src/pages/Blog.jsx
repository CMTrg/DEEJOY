import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import AnimatedBackground from "../components/AnimatedBackground";
import Footer from "../components/Footer";
import BlogPostInput from "../components/BlogPostInput";
import SamplePostList from "../components/SamplePostList";
import BlogOverlay from "../components/BlogOverlay"; // Make sure it's imported
import api from "../api/api";

function Blog() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await api.get("/reviews");
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleCloseOverlay = () => setSelectedPost(null);

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
      <BlogPostInput onPostSuccess={fetchReviews} />
      <SamplePostList
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        reviews={reviews}
        loading={loading}
        fetchReviews={fetchReviews}
      />
      <Footer sx={{ position: "relative" }} />

      {selectedPost && (
        <BlogOverlay post={selectedPost} onClose={handleCloseOverlay} />
      )}
    </Box>
  );
}

export default Blog;
