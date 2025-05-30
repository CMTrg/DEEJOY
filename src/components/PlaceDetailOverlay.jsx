import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Avatar,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import StarIcon from "@mui/icons-material/Star";

export default function PlaceDetailOverlay({ data, onClose }) {
  if (!data) return null;

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
          height: "auto",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
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
        {/* Rating badge */}
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

        <CardContent
          sx={{
            pb: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="800"
            color="text.primary"
            sx={{ fontFamily: "Outfit", width: "100%" }}
          >
            {data.title}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontFamily: "Outfit", mb: 1 }}
          >
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

        {/* Description */}
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
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Outfit",
              color: "text.primary",
            }}
          >
            {data.description}
          </Typography>
        </Box>

        {/* Interaction icons */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, width: "90%" }}
        >
          <IconWithText icon={<FavoriteBorderIcon />} text={data.likes} />
          <IconWithText icon={<ChatBubbleOutlineIcon />} text={data.comments} />
          <IconWithText icon={<ShareIcon />} text={data.shares} />
        </Stack>

        {/* Scrollable comments section */}
        <Box
          sx={{
            mt: 2,
            maxHeight: 200,
            overflowY: "auto",
            bgcolor: "background.paper", // Use theme's paper color
            color: "text.primary", // Use theme's primary text color
            p: 2,
            borderRadius: 2,
            width: "90%",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Comments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This is where the comments will be loaded and scrollable...
          </Typography>
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
