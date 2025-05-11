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
  getDestinationsByCategoryAndLocation
} from "../controllers/destinationController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin, isAdminOrCollaborator } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", verifyToken, isAdminOrCollaborator, addDestination);


router.get("/test/foursquare", async (req, res) => {
  const venueId = "569af0e3498ed45804d58a1c"; 
  const url = `https://api.foursquare.com/v3/places/${venueId}`;

  const options = {
    method: 'GET',
    url,
    headers: {
      accept: 'application/json',
      Authorization: process.env.FOURSQUARE_API_KEY
    }
  };

  try {
    const response = await axios.request(options);
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error("Foursquare test error:", error.message);
    res.status(500).json({
      success: false,
      message: "Foursquare API test failed",
      error: error.message
    });
  }
});
router.get("/explore/random", exploreRandomDestinations);
router.get("/explore/category", getDestinationsByCategoryAndLocation);

router.get("/", getDestinations);
router.get("/:id", getDestinationById);

router.put("/trending", verifyToken, isAdmin, updateTrendingDestinations);
router.put("/:id", verifyToken, isAdminOrCollaborator, updateDestination);

router.delete("/:id", verifyToken, isAdmin, deleteDestination);



export default router;