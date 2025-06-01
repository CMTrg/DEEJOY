import express from 'express';
import passport from 'passport';
import { googleCallback } from '../controllers/googleAuthController.js';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/auth/google/failure',
    session: false,
  }),
  googleCallback
);

router.get('/google/failure', (req, res) => {
  res.redirect('http://localhost:5173?error=' + encodeURIComponent('Email already in use. Please login with your email and password.'));
});

export default router;
