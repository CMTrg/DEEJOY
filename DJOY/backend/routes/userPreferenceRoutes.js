import express from "express";
import {
  getUserPreferences,
  setUserPreferences,
  deleteUserPreferences
} from "../controllers/userPreferenceController.js"; 

import { verifyToken } from "../middleware/authMiddleware.js"; 

const router = express.Router();

router.get("/", verifyToken, getUserPreferences);
router.post("/", verifyToken, setUserPreferences);
router.delete("/", verifyToken, deleteUserPreferences);

export default router;
