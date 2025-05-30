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

            <Divider sx={{ my: 1 }} />
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", mb: 2 }}>{post.content}</Typography>

            {post.image && (
              <Box sx={{ mt: 2, maxWidth: 300, maxHeight: 200, overflow: "hidden", borderRadius: 2, border: "1px solid #ccc" }}>
                <img src={post.image} alt="Post Preview" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
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
  );
}
