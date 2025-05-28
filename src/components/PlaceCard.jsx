import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import api from "../api/api";

export default function PlaceCard({
  destinationId,
  userId,
  image,
  title,
  address,
  rating,
  description,
  shares,
  comments,
  initialLikes,
  onAttemptRemove,
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes || 0);

  useEffect(() => {
  const fetchFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; 

    try {
      const res = await api.get("/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const isFavorite = res.data.some((fav) => {
        const id = fav.destinationId._id || fav.destinationId;
        return id === destinationId;
      });

      setLiked(isFavorite);
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
    }
  };

  if (userId) fetchFavorite();
}, [destinationId, userId]);

  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("User not logged in. Favorite action blocked.");
      alert("Please log in to add or remove favorites."); 
      return;
    }

    if (onAttemptRemove) {
      onAttemptRemove(destinationId);
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (liked) {
        await api.delete("/favorites", {
          ...config,
          data: { destinationId },
        });
        setLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        await api.post("/favorites", { destinationId }, config);
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };


  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: "270px",
        height: 345,
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 1,
        gap: 1,
        bgcolor: (theme) =>
          theme.palette.mode === "light"
            ? "rgba(238,238,238,0.75)"
            : "rgba(6,10,18,0.75)",
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "4px 4px 12px rgba(238,238,238,0.75)"
            : "4px 4px 12px rgba(0,0,0,0.5)",
        position: "relative",
      }}
    >
      
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
          fontSize: "0.8rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          zIndex: 2,
        }}
      >
        <StarIcon sx={{ fontSize: "1rem" }} />
        {rating}
      </Box>

      <CardContent
        sx={{
          pb: 0.5,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <Typography
          variant="subtitle1"
          fontWeight="800"
          color="text.primary"
          sx={{ fontFamily: "Outfit" }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "Outfit", mb: 1 }}
        >
          {address}
        </Typography>
      </CardContent>

      <Box sx={{ position: "relative", width: "90%" }}>
        <Box sx={{ position: "relative", width: "100%", height: "auto" }}>
          <CardMedia
            component="img"
            image={image}
            alt={title}
            sx={{
              width: "100%",
              height: 140,
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          <Avatar
            sx={{
              position: "absolute",
              bottom: 8,
              left: 8,
              width: 24,
              height: 24,
              bgcolor: "white",
              color: "primary.main",
              fontSize: 12,
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
            p: 1,
            width: "100%",
            minHeight: "60px",
            borderBottomLeftRadius: "10px",
            borderBottomRightRadius: "10px",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Outfit",
              color: "text.primary",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {description}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: "primary.text",
              fontWeight: 500,
              cursor: "pointer",
              "&:hover": { color: "primary.texthover" },
            }}
          >
            see more...
          </Typography>
        </Box>
      </Box>

      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1.5, mb: 1, width: "100%" }}
      >
        <IconWithText
          icon={
            <IconButton onClick={toggleFavorite} sx={{ p: 0.5 }}>
              {liked ? (
                <FavoriteIcon color="error" fontSize="small" />
              ) : (
                <FavoriteBorderIcon fontSize="small" />
              )}
            </IconButton>
          }
          text={likeCount}
        />
        <IconWithText
          icon={<ChatBubbleOutlineIcon fontSize="small" />}
          text={comments}
        />
        <IconWithText icon={<ShareIcon fontSize="small" />} text={shares} />
      </Stack>
    </Card>
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
