import express from "express";
import axios from "axios";
import {
  addDestination,
  getDestinations,
  getDestinationById,
  updateTrendingDestinations,
  updateDestination,
  deleteDestination,
  exploreRandomDestinations,
  exploreBySingleCategory,
  searchDestinations,
  getAutocompleteSuggestions
} from "../controllers/destinationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrCollaborator } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdminOrCollaborator, addDestination);

router.get("/autocomplete", getAutocompleteSuggestions);
router.get("/explore/random", exploreRandomDestinations);
router.get("/explore/category/:category", exploreBySingleCategory);
router.get("/search", searchDestinations);

router.get("/", getDestinations);
router.get("/:id", getDestinationById);

router.put("/trending", verifyToken, isAdmin, updateTrendingDestinations);
router.put("/:id", verifyToken, isAdminOrCollaborator, updateDestination);

router.delete("/:id", verifyToken, isAdmin, deleteDestination);



export default router;