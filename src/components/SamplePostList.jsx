import React from "react";
import {
  Box,
  Avatar,
  Typography,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";

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

export default function SamplePostList() {
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
      {samplePosts.map((post) => (
        <Box
          key={post.id}
          sx={{
            p: 2,
            borderRadius: 3,
            backgroundColor: "rgba(82,28,206,0.25)",
            backdropFilter: "blur(4px)",
            boxShadow: 2,
          }}
        >
          {/* Header */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 2 }}>
            <Avatar src={post.avatar} alt={post.name} />
            <Box>
              <Typography fontWeight="bold">{post.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {post.time}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Content */}
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>
            {post.content}
          </Typography>

          {/* Image (if exists) */}
          {post.image && (
            <Box
              sx={{
                mt: 2,
                maxWidth: 300,
                maxHeight: 200,
                overflow: "hidden",
                borderRadius: 2,
                border: "1px solid #ccc",
              }}
            >
              <img
                src={post.image}
                alt="Post Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </Box>
          )}

          {/* Buttons */}
          <Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
            <Tooltip title="Like">
              <IconButton size="small" color="primary">
                <FavoriteBorderIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Comment">
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
