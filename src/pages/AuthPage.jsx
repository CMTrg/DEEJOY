import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  Link,
  Divider,
} from '@mui/material';
import AnimatedBackground from '../components/AnimatedBackground';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <AnimatedBackground></AnimatedBackground>
{/*       <Navbar></Navbar>
 */}      <Paper
        elevation={6}
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        sx={{
          p: 4,
          borderRadius: 4,
          width: '100%',
          maxWidth: 400,
          backgroundColor: theme.palette.mode === 'dark' ? '#333' : 'white',           
        }}
      >
        <Tabs
          value={tab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ mb: 3 }}
        >
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>

        {tab === 0 ? (
          <Box component="form" noValidate>
            <Typography variant="h6" gutterBottom sx={{textAlign: 'center'}}>
              Welcome Back
            </Typography>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
            />
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link href="#" underline="hover" fontSize={14}>
                Forgot password?
              </Link>
            </Box>
            <Box sx={{display:'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, width: '80%' }}
            >
              Login
            </Button>
            <Divider sx={{ my: 2 }}>or</Divider>
            <Button fullWidth variant="outlined" sx={{width: '80%'}}>
              Continue with Email
            </Button>
            </Box>
           
          </Box>
        ) : (
          <Box component="form" noValidate sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Typography variant="h6" gutterBottom>
              Create Account
            </Typography>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2, width:'80%' }}
            >
              Sign Up
            </Button>
            <Divider sx={{ my: 2 }}>or</Divider>
            <Button fullWidth variant="outlined" sx={{width: '80%'}}>
              Sign up with Email
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
