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
  
  export default function BlogOverlay({ post, onClose }) {
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([
      "Great post!",
      "I agree with you.",
    ]);
  
    const handleAddComment = () => {
      if (!newComment.trim()) return;
      setComments([...comments, newComment]);
      setNewComment("");
    };
  
    return (
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.6)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflowY: "auto",
          p: 2,
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            bgcolor: "background.paper",
            borderRadius: 3,
            p: 3,
            maxWidth: 700,
            width: "100%",
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>
  
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <Avatar src={post.avatar} />
            <Box>
              <Typography fontWeight="bold">{post.name}</Typography>
              <Typography variant="body2">{post.time}</Typography>
            </Box>
          </Box>
  
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 2 }}>{post.content}</Typography>
  
          {post.image && (
            <img
              src={post.image}
              style={{ width: "100%", borderRadius: "10px", marginBottom: "1rem" }}
              alt="Blog visual"
            />
          )}
  
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" fontWeight="bold" mb={1}>
            Comments
          </Typography>
  
          <Box
            sx={{ maxHeight: 200, overflowY: "auto", mb: 2, pr: 1 }}
          >
            {comments.map((cmt, idx) => (
              <Typography key={idx} variant="body2" mb={1}>
                - {cmt}
              </Typography>
            ))}
          </Box>
  
          <TextField
            fullWidth
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            size="small"
          />
          <Button
            variant="contained"
            sx={{ mt: 1, float: "right" }}
            onClick={handleAddComment}
          >
            Post Comment
          </Button>
        </Box>
      </Box>
    );
  }
  