import { Box, InputBase, IconButton, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PlaceIcon from "@mui/icons-material/Place";

export default function SearchBar() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        width: { xs: '70%', md: '50%' },
        height: "auto",
        bgcolor: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(4, 1, 54, 0.7)"
            : "rgba(255, 255, 255, 0.7)",
        borderRadius: "10px",
        px: 2,
        py: 1,
        boxShadow: (theme) =>
          theme.palette.mode === "light"
            ? "4px 4px 5.3px #A2A8FF"
            : "4px 4px 5.3px #8727FC",

        mb: 2,
      }}
    >
      <InputBase
        placeholder="Search for places here..."
        sx={{
          flexGrow: 1,
          fontFamily: "Outfit",
          fontSize: "1rem",
          color: "text.primary",
        }}
      />

      <IconButton sx={{ ml: 1 }}>
        <SearchIcon />
      </IconButton>

      <Box sx={{ ml: 1 }}>
        <Button
          variant="outlined"
          size="small"
          disableElevation
          disableRipple
          sx={{
            minWidth: "auto", // cho phép tự động co lại
            width: "36px", // ép chiều rộng tối đa
            height: "36px", // ép chiều cao nếu cần
            padding: 0, // xoá padding nội bộ
            borderRadius: "999px",
            textTransform: "none",
            color: "text.primary",
            borderColor: "text.primary",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "#fff",
              borderColor: "primary.main",
            },
          }}
        >
          <PlaceIcon fontSize="small" />
        </Button>
      </Box>
    </Box>
  );
}
