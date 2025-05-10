import express from "express";
import {
  sendFriendRequest,
  acceptFriendRequest,
  getAcceptedFriends,
  getPendingFriends,
  declineFriendRequest,
  getIncomingFriendRequests,
  rejectIncomingFriendRequest
} from "../controllers/friendListController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(verifyToken);

router.post("/send", sendFriendRequest);
router.post("/accept", acceptFriendRequest);
router.get("/accepted/:userId", getAcceptedFriends);
router.get("/pending/:userId", getPendingFriends);
router.post("/decline", declineFriendRequest);
router.get("/incoming/:userId", getIncomingFriendRequests);
router.post("/reject", rejectIncomingFriendRequest);

export default router;
