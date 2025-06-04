import express from "express";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
  checkFavoriteStatus
} from "../controllers/favoriteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addFavorite);
router.get("/", verifyToken, getUserFavorites);
router.delete("/", verifyToken, removeFavorite);
router.get("/status", verifyToken, checkFavoriteStatus);


export default router;
