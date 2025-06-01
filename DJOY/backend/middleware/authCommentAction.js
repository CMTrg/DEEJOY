import { commentModel } from "../models/reviewModel.js";

export const authorizeCommentAction = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await commentModel.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const isAuthor = comment.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (req.method === "PUT") {
      if (!isAuthor) return res.status(403).json({ message: "Not authorized to edit this comment" });
    } else if (req.method === "DELETE") {
      if (!isAuthor && !isAdmin) return res.status(403).json({ message: "Not authorized to delete this comment" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
