import { AppBar, Toolbar, Typography, Box, IconButton, Button, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { left } from '@popperjs/core';
import { padding } from '@mui/system';

export default function Navbar() {
  const theme = useTheme();

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(11,1,72,0.3)' : 'rgba(177,191,255,0.5)', 
        backdropFilter: 'blur(10px)',
        zIndex: 1100,
        height: '58px',
        boxShadow: theme.palette.mode === 'dark' ? '0px 1.25px 12.5px rgba(41, 10, 140, 1)' : '0px 5px 12.5px rgba(179, 194, 255, 0.4)',

      }}
    >
      <Toolbar sx={{
        justifyContent: 'space-between'}}>
        <Typography variant="h5" fontWeight="bold" color='text.primary' sx={{ paddingLeft: "0.5%", fontFamily: "'Outfit', sans-serif", letterSpacing: '0.2rem' }}>
          DEEJOY
        </Typography>

        <Box sx={{ paddingRight: "0.5%"}}>
          <Box>
            <Button>Home</Button>
            <Button>Favourite</Button>
            <Button>Blog</Button>
            <Button>About</Button>
          </Box>
          <IconButton edge="end" color="inherit" sx={{ display: {
            xs: 'block',
            sm: 'none',
          }}}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
