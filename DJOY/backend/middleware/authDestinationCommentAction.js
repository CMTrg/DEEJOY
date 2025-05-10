import DestinationComment from "../models/DestinationComment.js";
import asyncHandler from "express-async-handler";

export const authorizeDestinationCommentAction = asyncHandler(async (req, res, next) => {
  const commentId = req.params.commentId;
  const userId = req.user._id;

  const comment = await DestinationComment.findById(commentId);

  if (!comment) {
    return res.status(404).json({ message: "Destination comment not found" });
  }

  if (comment.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Not authorized to modify this comment" });
  }

  next();
});
