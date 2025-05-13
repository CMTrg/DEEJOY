import React, { useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  TextareaAutosize,
} from '@mui/material';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'; // Sửa tên đúng

export default function BlogPostInput() {
  const [postText, setPostText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handlePost = () => {
    console.log('Post content:', postText);
    console.log('Image:', imagePreview);
    // TODO: Send to backend here
    setPostText('');
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImagePreview(imgUrl);
    }
  };

  return (
    <Box
      sx={{
        mt: 4,
        width: "80%",
        borderRadius: "20px",
        p: 2,
        backgroundColor: "blogbox.main",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        zIndex: 1000,
        position: "relative", // ✅ Đổi từ fixed nếu không muốn đè toàn page
        "& textarea::placeholder": {
          color: "black",
          opacity: 1,
        },
      }}
    >
      <Box className="blog-input" sx={{ display: 'flex', flexDirection: 'row' }}>
        <TextareaAutosize
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
          placeholder="Write your review here..."
          minRows={2}
          style={{
            flex: 1,
            padding: "12px",
            border: "none",
            fontSize: 16,
            resize: "none",
            outline: "none",
            color: "inherit",
            backgroundColor: "transparent",
          }}
        />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, ml: 1 }}>
          <Button variant="outlined" color="primary" onClick={handlePost}>
            Post
          </Button>
        </Box>
      </Box>

      {imagePreview && (
        <Box sx={{ mt: 2, maxWidth: 300,
          maxHeight: 200,
          overflow: 'hidden',
          borderRadius: 2,
          border: '1px solid #ccc', }}>
          <img
            src={imagePreview}
            alt="Preview"
            style={{ maxWidth: '100%', borderRadius: '12px' }}
          />
        </Box>
      )}

      <Box sx={{ width: '15%', display: 'flex', gap: 1 }}>
        <IconButton component="label" color="primary">
          <AddPhotoAlternateOutlinedIcon />
          <input type="file" accept="image/*" hidden onChange={handleImageUpload} />
        </IconButton>

        <IconButton color="primary" onClick={() => console.log("Tag a location")}>
          <LocationOnOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
