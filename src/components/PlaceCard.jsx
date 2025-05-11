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
import { flexbox } from "@mui/system";

export default function PlaceCard({
  image,
  title,
  address,
  rating,
  description,
  likes,
  shares,
  comments,
}) {
  return (
    <Card
      sx={{
        width: "100%", // chiếm trọn ô của grid
        maxWidth: "270px", // không vượt quá
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
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "auto",
          }}
        >
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
          {/* Avatar on image */}
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

        {/* Description box */}
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
            sx={{ color: "primary.text", fontWeight: 500,
        cursor: 'pointer', '&:hover' : {color: 'primary.texthover'} }}
          >
            see more...
          </Typography>
        </Box>
      </Box>

      {/* Icons row */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ px: 1.5, mb: 1, width: '100%' }}
      >
        <IconWithText icon={<FavoriteBorderIcon />} text={likes} />
        <IconWithText icon={<ChatBubbleOutlineIcon />} text={comments} />
        <IconWithText icon={<ShareIcon />} text={shares} />
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
