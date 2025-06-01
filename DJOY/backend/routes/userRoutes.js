import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  forgotPassword,
  resetPassword
} from '../controllers/userController.js';
import { verifyEmail } from '../controllers/pendingUserController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.post('/verify', verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile', verifyToken, getUserProfile);
router.put("/update/:userId", verifyToken, upload.single("profilePicture"), updateUserProfile);
router.delete('/:id', verifyToken, deleteUser);

export default router;
