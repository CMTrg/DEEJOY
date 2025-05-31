import express from "express";
import {
  addReview,
  getAllReviews,
  getReviewWithComment,
  deleteReview,
  editReview,
  searchReviews,
  addCommentToReview,
  editComment,
  deleteComment,
  replyToComment,
  getCommentsForReview,
  getCommentLikes,
  getReviewLikes,
  toggleLikeReview,
  toggleLikeComment,
  hasUserLikedReview,
  alreadyLikedComment,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeReviewAction } from "../middleware/authReviewAction.js";
import { authorizeCommentAction } from "../middleware/authCommentAction.js";
import { upload } from "../config/cloudinary.js";


const router = express.Router();

router.post("/", upload.array("images", 5), verifyToken, addReview);  
router.get("/", getAllReviews);                    
router.get("/search", searchReviews);                       
router.get("/:reviewId", getReviewWithComment);              
router.put("/:reviewId", verifyToken, authorizeReviewAction,editReview);                        
router.delete("/:reviewId", verifyToken, authorizeReviewAction, deleteReview);                   
router.post("/:reviewId/toggle-like", verifyToken, toggleLikeReview);    
router.get("/:reviewId/likes", getReviewLikes);              

router.post("/:reviewId/comments", verifyToken, upload.single("image"), addCommentToReview);           
router.get("/:reviewId/comments", getCommentsForReview);          
router.put("/comments/:commentId", verifyToken, authorizeCommentAction, editComment);                
router.delete("/comments/:commentId", verifyToken, authorizeCommentAction, deleteComment);             
router.post("/comments/:commentId/reply", verifyToken, replyToComment);       
router.post("/comments/:commentId/toggle-like", verifyToken, toggleLikeComment);
router.get("/comments/:commentId/likes", getCommentLikes);        
router.get("/:reviewId/liked", verifyToken, hasUserLikedReview);
router.get("/comments/:commentId/alreadyLiked", verifyToken, alreadyLikedComment);

export default router;
