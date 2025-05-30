import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
  Modal,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import api from "../api/api";

export default function SamplePostList({ reviews, loading, fetchReviews }) {
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


const samplePosts = [
  {
    id: 1,
    name: "Alice Nguyen",
    avatar: "https://i.pravatar.cc/150?img=3",
    time: "2 hours ago",
    content: "Today I tried something new and it was amazing! 💡✨",
    image: "testcard.jpg",
  },
  {
    id: 2,
    name: "Bình Tran",
    avatar: "https://i.pravatar.cc/150?img=5",
    time: "5 hours ago",
    content: "Just finished a tough workout. Feeling proud! 💪🔥",
  },
];

// Giả lập người dùng hiện tại
const currentUser = {
  name: "Your Name",
  avatar: "https://i.pravatar.cc/150?img=10",
};

export default function SamplePostList() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState({});

  const handleClose = () => {
    setSelectedPost(null);
    setComment("");
  };

  const handleAddComment = () => {
    if (comment.trim()) {
      const newComment = {
        id: Date.now(),
        name: currentUser.name,
        avatar: currentUser.avatar,
        text: comment.trim(),
      };

      setComments((prev) => ({
        ...prev,
        [selectedPost.id]: [...(prev[selectedPost.id] || []), newComment],
      }));
      setComment("");
    }
  };

  return (
    <>
      <Box sx={{ width: "80%", mx: "auto", mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
        {samplePosts.map((post) => (
          <Box
            key={post.id}
            onClick={() => setSelectedPost(post)}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: "rgba(82,28,206,0.25)",
              backdropFilter: "blur(4px)",
              boxShadow: 2,
              cursor: "pointer",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
              <Avatar src={post.avatar} alt={post.name} />
              <Box>
                <Typography fontWeight="bold">{post.name}</Typography>
                <Typography variant="body2" color="text.secondary">{post.time}</Typography>
              </Box>
            </Box>
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
            <Avatar
            src={
              review.user?.profilePicture?.startsWith("http")
                ? review.user.profilePicture
                : review.user?.profilePicture
                ? `http://localhost:4000/${review.user.profilePicture}`
                : undefined
            }
            alt={review.user?.username || "User"}
            sx={{ bgcolor: "beige", fontWeight: "bold" }}
          >
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
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>{post.content}</Typography>
          <Divider sx={{ my: 1 }} />

          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
            {review.comment}
          </Typography>

            {post.image && (
              <Box sx={{ mt: 2, maxWidth: 300, maxHeight: 200, overflow: "hidden", borderRadius: 2, border: "1px solid #ccc" }}>
                <img src={post.image} alt="Post Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
              </Box>
            )}
          {review.images && review.images.length > 0 && (
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

            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="Like">
                <IconButton size="small" color="primary"><FavoriteBorderIcon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Comment">
                <IconButton size="small" color="primary"><ChatBubbleOutlineIcon fontSize="small" /></IconButton>
              </Tooltip>
              <Tooltip title="Share">
                <IconButton size="small" color="primary"><ShareOutlinedIcon fontSize="small" /></IconButton>
              </Tooltip>
            </Box>
          </Box>
        ))}
      </Box>

      <Modal open={!!selectedPost} onClose={handleClose}>
        <Box onClick={handleClose} sx={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", bgcolor: "rgba(0,0,0,0.5)", zIndex: 1000 }}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "80%", maxHeight: "90vh", bgcolor: "background.paper", color: "text.primary", borderRadius: 3, p: 4, overflowY: "auto" }}
          >
            {selectedPost && (
              <>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
                  <Avatar src={selectedPost.avatar} alt={selectedPost.name} />
                  <Box>
                    <Typography fontWeight="bold">{selectedPost.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{selectedPost.time}</Typography>
                  </Box>
                </Box>

                <Typography variant="body1" mb={2}>{selectedPost.content}</Typography>

                {selectedPost.image && (
                  <Box sx={{ mt: 2, maxWidth: "100%", maxHeight: 400, overflow: "hidden", borderRadius: 2, border: "1px solid #ccc" }}>
                    <img src={selectedPost.image} alt="Full Post" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* Comment section */}

                <Box sx={{ display: "flex", gap: 2 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    size="small"
                    sx={{
                    }}
                  />
                  <Button onClick={handleAddComment} variant="contained">Send</Button>
                </Box>
                <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
                  {(comments[selectedPost.id] || []).map((cmt, index) => (
                    <Box key={index} sx={{ mt: 2,  }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={cmt.avatar} alt={cmt.name} sx={{ width: 30, height: 30 }} />
                        <Box>
                          <Typography variant="subtitle2">{cmt.name}</Typography>
                          <Typography variant="body2">{cmt.text}</Typography>
                        </Box>
                        <IconButton size="small" color="primary"><FavoriteBorderIcon fontSize="small" /></IconButton>
                      </Box>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Box>

              </>
            )}
          </Box>
        </Box>
      </Modal>
    </>
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
