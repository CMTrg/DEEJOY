import { reviewModel } from "../models/Review.js";

export const authorizeReviewAction = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const review = await reviewModel.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const isAuthor = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (req.method === "PUT") {
      if (!isAuthor) return res.status(403).json({ message: "Not authorized to edit this review" });
    } else if (req.method === "DELETE") {
      if (!isAuthor && !isAdmin) return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
