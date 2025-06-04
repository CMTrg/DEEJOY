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
import PlaceDetailOverlay from "./PlaceDetailOverlay.jsx";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { useUser } from "../UserContext";
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
  onClick,
}) {
  const [likeCount, setLikeCount] = useState(initialLikes || 0);
  const [detailOpen, setDetailOpen] = useState(false);
  const { token, likedState, setLikedState } = useUser();
  const liked = likedState[destinationId]?.liked || false;

  useEffect(() => {
    const fetchStatus = async () => {
      if (!token) return;
      try {
        const res = await api.get(`/favorites/status?destinationId=${destinationId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikedState((prev) => ({
          ...prev,
          [destinationId]: { liked: res.data.liked },
        }));
      } catch (err) {
        console.error("Error fetching like status:", err);
      }
    };

    if (!(destinationId in likedState)) {
      fetchStatus();
    }
  }, [token, destinationId, likedState, setLikedState]);

  const toggleFavorite = async (e) => {
    e.stopPropagation();

    if (!token) {
      alert("Please log in to like this place.");
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
        setLikedState((prev) => ({
          ...prev,
          [destinationId]: { liked: false },
        }));
        setLikeCount((prev) => prev - 1);
      } else {
        await api.post("/favorites", { destinationId }, config);
        setLikedState((prev) => ({
          ...prev,
          [destinationId]: { liked: true },
        }));
        setLikeCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    }
  };

  const openDetails = () => {
    onClick?.();
    setDetailOpen(true);
  };

  const closeDetails = () => setDetailOpen(false);

  return (
    <>
      <Card
        onClick={openDetails}
        sx={{
          cursor: "pointer",
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
            px: 1,
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
            sx={{
              fontFamily: "Outfit",
              width: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: "Outfit",
              mb: 1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {address}
          </Typography>
        </CardContent>

        <Box sx={{ position: "relative", width: "90%" }}>
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

      {detailOpen && (
        <PlaceDetailOverlay
          data={{
            destinationId,
            image,
            title,
            address,
            rating,
            description,
            likes: likeCount,
            shares,
            comments,
          }}
          onClose={closeDetails}
        />
      )}
    </>
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
