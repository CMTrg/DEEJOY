import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, username, password } = location.state || {};

  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!email || !username || !password) {
      setError('Missing verification data. Please sign up again.');
      return;
    }

    try {
      await api.post('/users/verify', {
        email,
        verificationCode: verificationCode.trim(),
    });

      alert('Verification successful!');
      navigate('/auth');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
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
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h6" gutterBottom>
          Verify Your Email
        </Typography>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Box component="form" onSubmit={handleVerify}>
          <TextField
            label="Verification Code"
            fullWidth
            margin="normal"
            required
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
          />

          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Verify Code
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
