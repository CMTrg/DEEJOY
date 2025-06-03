import express from 'express';
import passport from 'passport';
import { googleCallback } from '../controllers/googleAuthController.js';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err || !user) {
      const errorMessage = info?.message || 'Google login failed.';
      return res.send(`
        <html>
          <body>
            <script>
              window.opener.postMessage({ error: "${errorMessage}" }, "http://localhost:5173");
              window.close();
            </script>
          </body>
        </html>
      `);
    }

    req.user = user; 
    googleCallback(req, res); 
  })(req, res, next);
});

router.get('/google/failure', (req, res) => {
  res.redirect('http://localhost:5173?error=' + encodeURIComponent('Email already in use. Please login with your email and password.'));
});

export default router;
