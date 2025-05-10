import express from "express";
import {
  addDestination,
  getDestinations,
  getDestinationById,
  updateTrendingDestinations,
  updateDestination,
  deleteDestination,
} from "../controllers/destinationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrCollaborator } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdminOrCollaborator, addDestination);
router.get("/", getDestinations);
router.get("/:id", getDestinationById);
router.put("/trending", verifyToken, isAdmin, updateTrendingDestinations);
router.put("/:id", verifyToken, isAdminOrCollaborator, updateDestination);
router.delete("/:id", verifyToken, isAdmin, deleteDestination);

export default router;