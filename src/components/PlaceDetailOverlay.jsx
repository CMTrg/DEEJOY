import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import { useState } from "react";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloseIcon from "@mui/icons-material/Close";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarIcon from "@mui/icons-material/Star";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DestinationCommentSection from "./DestinationCommentSection";
import api from "../api/api";
import { useUser } from "../UserContext";

export default function PlaceDetailOverlay({ data, onClose }) {
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [commentTrigger, setCommentTrigger] = useState(0); // 🔄 Trigger for reloading comments
  const { user, token } = useUser();

  if (!data) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => setImage(null);

  const handleSubmit = async () => {
    if (!commentText.trim()) return alert("Please write a comment.");
    if (rating === 0) return alert("Please select a rating.");

    const formData = new FormData();
    formData.append("text", commentText);
    formData.append("rating", rating);
    formData.append("destinationId", data.destinationId);
    if (image?.file) {
      formData.append("image", image.file);
    }

    try {
      const res = await api.post("/destination-comments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Comment added:", res.data);

      setCommentText("");
      setRating(0);
      setImage(null);
      setCommentTrigger(prev => prev + 1); // ✅ Trigger re-render of comments

    } catch (error) {
      console.error("Failed to submit comment:", error);
      alert("Failed to submit comment. Please try again.");
    }
  };

  return (
    <Box
      onClick={onClose}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        overflowY: "auto",
        padding: 2,
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: "100%",
          maxWidth: "800px",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 2,
          gap: 2,
          mt: 5,
          bgcolor: (theme) =>
            theme.palette.mode === "light"
              ? "rgba(238,238,238,0.95)"
              : "rgba(6,10,18,0.95)",
          boxShadow: (theme) =>
            theme.palette.mode === "light"
              ? "4px 4px 18px rgba(0,0,0,0.2)"
              : "4px 4px 18px rgba(0,0,0,0.8)",
          position: "relative",
        }}
      >
        {/* Rating Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            bgcolor: "black",
            color: "yellow",
            px: 1.2,
            py: 0.4,
            borderBottomLeftRadius: "12px",
            fontSize: "0.9rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            zIndex: 2,
          }}
        >
          <StarIcon sx={{ fontSize: "1rem" }} />
          {data.rating}
        </Box>

        <CardContent sx={{ width: "100%", pb: 1 }}>
          <Typography variant="h5" fontWeight={800} sx={{ fontFamily: "Outfit" }}>
            {data.title}
          </Typography>
          <Typography color="text.secondary" sx={{ fontFamily: "Outfit", mb: 1 }}>
            {data.address}
          </Typography>
        </CardContent>

        <Box sx={{ position: "relative", width: "90%" }}>
          <CardMedia
            component="img"
            image={data.image}
            alt={data.title}
            sx={{
              width: "100%",
              height: "280px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          <Avatar
            sx={{
              position: "absolute",
              bottom: 12,
              left: 12,
              width: 32,
              height: 32,
              bgcolor: "white",
              color: "primary.main",
              fontSize: 14,
            }}
          >
            NT
          </Avatar>
        </Box>

        <Box
          sx={{
            bgcolor: (theme) =>
              theme.palette.mode === "light"
                ? "rgba(138,180,255,0.4)"
                : "#0B0241",
            p: 2,
            width: "90%",
            borderRadius: "10px",
          }}
        >
          <Typography sx={{ fontFamily: "Outfit" }}>{data.description}</Typography>
        </Box>

        <Stack direction="row" justifyContent="space-between" sx={{ px: 1.5, width: "90%" }}>
          <IconWithText icon={<FavoriteBorderIcon />} text={data.likes} />
          <IconWithText icon={<ChatBubbleOutlineIcon />} text={data.comments} />
          <IconWithText icon={<ShareIcon />} text={data.shares} />
        </Stack>

        {/* Comments + Review Form */}
        <Box
          sx={{
            mt: 2,
            maxHeight: 300,
            overflowY: "auto",
            bgcolor: "background.paper",
            color: "text.primary",
            p: 2,
            borderRadius: 2,
            width: "90%",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Comments
          </Typography>

          <Box sx={{ width: "100%", mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Leave a Review
            </Typography>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              rows={3}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                resize: "none",
                outline: "none",
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <IconButton
                  key={star}
                  onClick={() => setRating(star)}
                  color={rating >= star ? "warning" : "default"}
                >
                  {rating >= star ? <StarIcon /> : <StarOutlineIcon />}
                </IconButton>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
              <IconButton component="label" color="primary">
                <AddPhotoAlternateOutlinedIcon />
                <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
              </IconButton>

              {image && (
                <Box sx={{ position: "relative", ml: 2 }}>
                  <img
                    src={image.preview}
                    alt="preview"
                    style={{
                      width: 100,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      color: "red",
                      backgroundColor: "rgba(255,255,255,0.8)",
                    }}
                    onClick={removeImage}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
            </Box>

            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              Submit Review
            </Button>
          </Box>

          <DestinationCommentSection
            key={commentTrigger}
            destinationId={data.destinationId}
          />
        </Box>
      </Card>
    </Box>
  );
}

function IconWithText({ icon, text }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
      {icon}
      <Typography variant="caption">{text}</Typography>
    </Box>
  );
}
