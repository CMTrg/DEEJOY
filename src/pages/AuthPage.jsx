import React, { useState, useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/');
    }
  }, []);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      alert(error);
    }
  }, []);


  const handleOAuthLogin = () => {
    const width = 500;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    window.open(
      'http://localhost:4000/auth/google',
      'Google Login',
      `width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleTabChange = (_, newValue) => setTab(newValue);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/login', {
        username: loginUsername,
        password: loginPassword,
      });
      localStorage.setItem('token', res.data.token);
      alert('Login successful!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users/register', {
        username: signupUsername,
        email: signupEmail,
        password: signupPassword,
        role: 'customer',
      });

      navigate('/verify-email', {
        state: {
          email: signupEmail,
          username: signupUsername,
          password: signupPassword,
        },
      });
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
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
      <AnimatedBackground />
      <Paper
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
          <Box component="form" onSubmit={handleLogin}>
            <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
              Welcome Back
            </Typography>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              required
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />
            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link
                component="button"
                underline="hover"
                fontSize={14}
                onClick={() => navigate('/forgot-password')}
              >
                Forgot password?
              </Link>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={{ mt: 2, width: '80%' }}
              >
                Login
              </Button>
              <Divider sx={{ my: 2 }}>or</Divider>
              <Button
                fullWidth
                variant="outlined"
                sx={{ width: '80%' }}
                onClick={handleOAuthLogin}
              >
                Continue with Google
              </Button>
            </Box>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSignup}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <Typography variant="h6" gutterBottom>
              Create Account
            </Typography>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              required
              value={signupUsername}
              onChange={(e) => setSignupUsername(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              type="submit"
              sx={{ mt: 2, width: '80%' }}
            >
              Sign Up
            </Button>
            <Divider sx={{ my: 2 }}>or</Divider>
            <Button
              fullWidth
              variant="outlined"
              sx={{ width: '80%' }}
              onClick={handleOAuthLogin}
            >
              Sign up with Google
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
