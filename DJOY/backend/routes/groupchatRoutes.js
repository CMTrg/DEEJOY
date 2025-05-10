import express from "express";
import {
  createGroupChat,
  addMemberToGroup,
  removeMemberFromGroup,
  sendMessage,
  getMessages,
  createTodoList,
  addDestinationToTodoList,
  voteForDestination,
  removeUnpopularDestinations,
  getGroupChat,
  deleteGroupChat
} from "../controllers/groupchatController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { authorizeGroupAdmin } from "../middleware/authGroupAdmin.js";

const router = express.Router();

router.post("/create", verifyToken, createGroupChat);
router.post("/add-member", verifyToken, addMemberToGroup);
router.post("/remove-member", verifyToken, removeMemberFromGroup);
router.get("/:groupId", verifyToken, getGroupChat);
router.delete("/:groupId", verifyToken, authorizeGroupAdmin, deleteGroupChat);

router.post("/send-message", verifyToken, sendMessage);
router.get("/messages/:groupId", verifyToken, getMessages);

router.post("/create-todo", verifyToken, createTodoList);
router.post("/add-destination", verifyToken, addDestinationToTodoList);
router.post("/vote", verifyToken, voteForDestination);
router.delete("/remove-unpopular", verifyToken, removeUnpopularDestinations);

export default router;
