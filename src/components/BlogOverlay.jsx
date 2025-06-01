import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Divider,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import api from "../api/api";

export default function BlogOverlay({ reviewId, post, onClose }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [likedComments, setLikedComments] = useState({});

  // Fetch comments and their like statuses
  useEffect(() => {
    if (!reviewId) return;

    const fetchCommentsAndLikes = async () => {
      try {
        // Fetch comments for the review
        const res = await api.get(`/reviews/${reviewId}/comments`);
        const commentsData = res.data || [];
        setComments(commentsData);

        // For each comment, call API to check if current user already liked it
        const likesMap = {};
        const token = localStorage.getItem("token");
        if (!token) {
          // If no token, user is not logged in, set all likes to false
          commentsData.forEach((comment) => {
            likesMap[comment._id] = false;
          });
          setLikedComments(likesMap);
          return;
        }

        await Promise.all(
          commentsData.map(async (comment) => {
            try {
              const likeRes = await api.get(
                `/reviews/comments/${comment._id}/alreadyLiked`,
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              likesMap[comment._id] = likeRes.data.alreadyLiked || false;
            } catch (err) {
              likesMap[comment._id] = false;
            }
          })
        );

        setLikedComments(likesMap);
      } catch (error) {
        console.error("Failed to fetch comments or like status", error);
      }
    };

    fetchCommentsAndLikes();

    // Cleanup preview URL on unmount or commentImage change
    return () => {
      if (commentImage) URL.revokeObjectURL(commentImage.preview);
    };
  }, [reviewId]);

  const toggleLikeComment = async (commentId) => {
    // Optimistically update UI
    setLikedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));

    try {
      const token = localStorage.getItem("token");
      await api.post(
        `/reviews/comments/${commentId}/toggle-like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh comments and likedComments after toggle
      const res = await api.get(`/reviews/${reviewId}/comments`);
      const commentsData = res.data || [];
      setComments(commentsData);

      const likesMap = {};
      await Promise.all(
        commentsData.map(async (comment) => {
          try {
            const likeRes = await api.get(
              `/reviews/comments/${comment._id}/alreadyLiked`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            likesMap[comment._id] = likeRes.data.alreadyLiked || false;
          } catch {
            likesMap[comment._id] = false;
          }
        })
      );
      setLikedComments(likesMap);
    } catch (error) {
      console.error("Failed to toggle like on comment", error);
      alert("Failed to toggle like on comment");

      // Revert optimistic update on failure
      setLikedComments((prev) => ({
        ...prev,
        [commentId]: prev[commentId], // no change, you can adjust if you want
      }));
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() && !commentImage) return;

    try {
      const formData = new FormData();
      formData.append("text", newComment.trim());
      if (commentImage) formData.append("image", commentImage.file);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await api.post(`/reviews/${reviewId}/comments`, formData, config);

      setNewComment("");
      setCommentImage(null);

      // Refresh comments and like status after adding
      const res = await api.get(`/reviews/${reviewId}/comments`);
      const commentsData = res.data || [];
      setComments(commentsData);

      const likesMap = {};
      await Promise.all(
        commentsData.map(async (comment) => {
          try {
            const likeRes = await api.get(
              `/reviews/comments/${comment._id}/alreadyLiked`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            likesMap[comment._id] = likeRes.data.alreadyLiked || false;
          } catch {
            likesMap[comment._id] = false;
          }
        })
      );
      setLikedComments(likesMap);
    } catch (error) {
      console.error("Failed to add comment", error);
      alert("Failed to add comment");
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      if (commentImage) URL.revokeObjectURL(commentImage.preview);

      const file = e.target.files[0];
      setCommentImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.5)",
        zIndex: 1300,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "auto",
        p: 2,
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          maxWidth: 600,
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 3,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label="close"
        >
          <CloseIcon />
        </IconButton>

        {/* Post header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}>
          <Avatar src={post.avatar} alt={post.name}>
            {!post.avatar && post.name?.[0]}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              {post.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {post.time}
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
        </Box>

        {/* Post content */}
        <Typography sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
          {post.content}
        </Typography>

        {/* Post image */}
        {post.image && (
          <Box
            sx={{
              width: "100%",
              maxHeight: 200,
              mb: 2,
              overflow: "auto",
              borderRadius: 2,
              border: "1px solid #ccc",
            }}
          >
            <img
              src={post.image}
              alt="Post"
              style={{
                width: "auto",
                maxWidth: "100%",
                height: "auto",
                maxHeight: 200,
                display: "block",
                margin: "0 auto",
              }}
            />
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        {/* Comments list */}
        <Box sx={{ maxHeight: 200, overflowY: "auto", mb: 2 }}>
          {comments.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No comments yet.
            </Typography>
          )}
          {comments.map((c) => (
            <Box
              key={c._id}
              sx={{
                display: "flex",
                gap: 1,
                mb: 1,
                alignItems: "flex-start",
                position: "relative",
                borderBottom: "1px solid #eee",
                pb: 1,
              }}
            >
              <Avatar
                src={c.user?.profilePicture}
                alt={c.user?.username || "User"}
                sx={{ width: 32, height: 32, mt: "4px" }}
              >
                {!c.user?.profilePicture && c.user?.username?.[0]}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                  {c.user?.username || "Anonymous"}
                </Typography>
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {c.text}
                </Typography>
                {c.image && (
                  <Box
                    sx={{
                      width: 150,
                      height: 100,
                      borderRadius: 1,
                      overflow: "hidden",
                      border: "1px solid #ccc",
                      mt: 0.5,
                    }}
                  >
                    <img
                      src={c.image}
                      alt="Comment"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <IconButton
                  onClick={() => toggleLikeComment(c._id)}
                  sx={{ ml: 1, mt: "4px" }}
                  size="small"
                  aria-label={likedComments[c._id] ? "Unlike" : "Like"}
                >
                  {likedComments[c._id] ? (
                    <FavoriteIcon color="error" fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
                <Typography variant="caption">{c.likes?.length || 0}</Typography>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Add new comment */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TextField
            multiline
            rows={3}
            placeholder="Write your comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddPhotoAlternateOutlinedIcon />}
            >
              {commentImage ? "Change Image" : "Add Image"}
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={handleImageChange}
              />
            </Button>

            {commentImage && (
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 1,
                  overflow: "hidden",
                  border: "1px solid #ccc",
                }}
              >
                <img
                  src={commentImage.preview}
                  alt="Preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />
            <Button variant="contained" onClick={handleAddComment}>
              Send
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
