import React, { useState, useEffect } from "react";
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
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import api from "../api/api";
import BlogOverlay from "./BlogOverlay";

export default function SamplePostList({ reviews, loading, fetchReviews }) {
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedStatus, setLikedStatus] = useState({}); // Store like status per reviewId
  const token = localStorage.getItem("token");

  // Fetch liked status for a given reviewId
  const fetchLikedStatus = async (reviewId) => {
    if (!token) return false; // no token means no like

    try {
      const res = await api.get(`/reviews/${reviewId}/liked`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.liked;
    } catch (error) {
      console.error(`Error fetching liked status for review ${reviewId}:`, error);
      return false;
    }
  };

  // When reviews change, fetch liked status for all
  useEffect(() => {
    if (!reviews || reviews.length === 0) return;

    const fetchAllLikedStatus = async () => {
      const statusObj = {};
      await Promise.all(
        reviews.map(async (review) => {
          statusObj[review._id] = await fetchLikedStatus(review._id);
        })
      );
      setLikedStatus(statusObj);
    };

    fetchAllLikedStatus();
  }, [reviews, token]);

  const handleLikeToggle = async (reviewId) => {
    if (!token) {
      alert("You must be logged in to like a review.");
      return;
    }
    try {
      await api.post(
        `/reviews/${reviewId}/toggle-like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews();

      // Optimistically update likedStatus after toggle
      setLikedStatus((prev) => ({
        ...prev,
        [reviewId]: !prev[reviewId],
      }));
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

  const getAvatarSrc = (user) => {
    if (!user) return undefined;
    if (user.profilePicture?.startsWith("http")) return user.profilePicture;
    if (user.profilePicture) return `http://localhost:4000/${user.profilePicture}`;
    return undefined;
  };

  return (
    <>
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
        {reviews.map((review) => {
          const isLiked = likedStatus[review._id] || false;

          return (
            <Box
              key={review._id}
              sx={{
                p: 2,
                borderRadius: 3,
                backgroundColor: "rgba(82,28,206,0.25)",
                backdropFilter: "blur(4px)",
                boxShadow: 2,
                cursor: "pointer",
              }}
              onClick={() => setSelectedPost(review)}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
                <Avatar src={getAvatarSrc(review.user)} alt={review.user?.username || "User"}>
                  {!review.user?.profilePicture && review.user?.username?.[0]}
                </Avatar>
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
                  🧭 {review.destination.name} — {review.destination.category}
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

              {review.images?.length > 0 && (
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
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
                        style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeToggle(review._id);
                    }}
                  >
                    {isLiked ? (
                      <FavoriteIcon fontSize="small" color="error" />
                    ) : (
                      <FavoriteBorderIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{review.likes?.length || 0}</Typography>

                <Tooltip title="Comments">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPost(review);
                    }}
                  >
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Typography variant="caption">{review.comments?.length || 0}</Typography>

                <Tooltip title="Share">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      alert("Share clicked! Implement your share logic here.");
                    }}
                  >
                    <ShareOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          );
        })}
      </Box>

      {selectedPost && (
        <BlogOverlay
          reviewId={selectedPost._id}
          post={{
            name: selectedPost.user?.username || "Anonymous",
            avatar: getAvatarSrc(selectedPost.user),
            time: new Date(selectedPost.createdAt).toLocaleString(),
            content: selectedPost.comment,
            image: selectedPost.images?.[0] || null,
          }}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </>
  );
}
