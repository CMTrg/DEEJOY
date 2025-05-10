import express from "express";
import {
  addFavorite,
  getUserFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, addFavorite);
router.get("/", verifyToken, getUserFavorites);
router.delete("/:id", verifyToken, removeFavorite);

export default router;
