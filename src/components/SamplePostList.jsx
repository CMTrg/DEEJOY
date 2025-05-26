import React, { useEffect, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import api from "../api/api";

export default function SamplePostList() {
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

  const handleLikeToggle = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to like a review.");
        return;
      }

      await api.post(
        `/reviews/${reviewId}/toggle-like`,
        {}, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchReviews(); 
    } catch (err) {
      console.error("Error toggling like:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to toggle like.");
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "80%",
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {reviews.map((review) => (
        <Box
          key={review._id}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(82,28,206,0.25)",
            backdropFilter: "blur(4px)",
            boxShadow: 2,
          }}
        >

          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
            <Avatar src={review.user?.profilePicture || ""} />
            <Box>
              <Typography fontWeight="bold">
                {review.user?.username || "Anonymous"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(review.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>

          {review.destination && (
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, fontStyle: "italic", color: "#6d6d6d" }}
            >
              🧭 Destination: {review.destination.name} —{" "}
              {review.destination.category}
            </Typography>
          )}

          {review.rating && (
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <StarIcon
                  key={i}
                  sx={{ color: i < review.rating ? "#FFD700" : "gray" }}
                  fontSize="small"
                />
              ))}
            </Box>
          )}

          <Divider sx={{ my: 1 }} />

          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
            {review.comment}
          </Typography>

          {review.images && review.images.length > 0 && (
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexWrap: "wrap",
                mt: 2,
              }}
            >
              {review.images.map((imgUrl, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: 200,
                    height: 150,
                    overflow: "hidden",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Review image ${idx + 1}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "12px",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 1,
              mt: 2,
            }}
          >
            <Tooltip title="Like">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleLikeToggle(review._id)}
              >
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption">
              {review.likes?.length || 0}
            </Typography>

            <Tooltip title="Comments">
              <IconButton size="small" color="primary">
                <ChatBubbleOutlineIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton size="small" color="primary">
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
