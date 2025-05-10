import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUser
} from '../controllers/userController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getUserProfile);
router.put("/update/:userId", verifyToken, upload.single("avatar"), updateUserProfile);
router.delete('/:id', verifyToken, deleteUser);

export default router;
