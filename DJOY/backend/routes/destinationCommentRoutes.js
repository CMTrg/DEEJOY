import express from "express";
import {
  addDestinationComment,
  editDestinationComment,
  deleteDestinationComment,
  getCommentsForDestination
} from "../controllers/destinationCommentController.js"; 
import { upload } from "../config/cloudinary.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeDestinationCommentAction } from "../middleware/authDestinationCommentAction.js";

const router = express.Router();

router.post("/", verifyToken, upload.single("image"), addDestinationComment);
router.put("/:commentId", verifyToken, authorizeDestinationCommentAction, editDestinationComment);
router.delete("/:commentId", verifyToken, authorizeDestinationCommentAction, deleteDestinationComment);
router.get("/destination/:destinationId", getCommentsForDestination);

export default router;
