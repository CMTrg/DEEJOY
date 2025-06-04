import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Avatar,
  CircularProgress,
  Stack,
  Rating,
} from "@mui/material";
import api from "../api/api"; 
import { useUser } from "../UserContext";

export default function DestinationCommentSection({ destinationId, refreshTrigger }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user} = useUser();

  const fetchComments = useCallback(async () => {
    if (!destinationId) return;
    setLoading(true);
    try {
      const res = await api.get(`/destination-comments/destination/${destinationId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoading(false);
    }
  }, [destinationId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={2}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (comments.length === 0) {
    return (
      <Box px={2}>
        <Typography variant="body2" color="text.secondary">
          No comments yet. Be the first to comment!
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2} px={2}>
      {comments.map((comment) => (
        <Box
          key={comment._id}
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "flex-start",
            bgcolor: "background.default",
            p: 1.5,
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Avatar src={comment.user?user.profilePicture:`http://localhost:4000/${user.profilePicture}`} alt={comment.user?.username}>
            {comment.user?.username?.[0]?.toUpperCase() || "U"}
          </Avatar>
          <Box flex={1}>
            <Typography variant="subtitle2" fontWeight="bold">
              {comment.user?.username || "Unknown User"}
            </Typography>

            {typeof comment.rating === "number" && (
              <Rating
                name={`rating-${comment._id}`}
                value={comment.rating}
                precision={0.5}
                size="small"
                readOnly
              />
            )}

            <Typography variant="body2" color="text.primary" mt={0.5}>
              {comment.text}
            </Typography>

            {comment.image && (
              <Box
                component="img"
                src={comment.image}
                alt="comment image"
                sx={{
                  width: "100%",
                  maxWidth: 200,
                  mt: 1,
                  borderRadius: 1,
                  objectFit: "cover",
                }}
              />
            )}
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
