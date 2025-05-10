import DestinationComment from "../models/destinationCommentModel.js";
import Destination from "../models/destinationModel.js";
import { upload } from "../config/cloudinary.js";

const updateDestinationRating = async (destinationId) => {
  const comments = await DestinationComment.find({ destination: destinationId });
  if (comments.length === 0) return;

  const avgRating = comments.reduce((sum, c) => sum + (c.rating || 0), 0) / comments.length;

  await Destination.findByIdAndUpdate(destinationId, {
    rating: parseFloat(avgRating.toFixed(1)),
    reviewCount: comments.length
  });
};

export const addDestinationComment = async (req, res) => {
  try {
    const { destinationId, userId, text, rating, reviewId } = req.body;

    const imageUrl = req.file?.path || null;

    const comment = new DestinationComment({
      destination: destinationId,
      user: userId,
      text,
      rating,
      image: imageUrl,
      review: reviewId || null
    });

    await comment.save();
    await updateDestinationRating(destinationId);

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const editDestinationComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, rating, image, reviewId } = req.body;

    const comment = await DestinationComment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.text = text ?? comment.text;
    comment.rating = rating ?? comment.rating;
    comment.image = image ?? comment.image;
    comment.review = reviewId ?? comment.review;

    await comment.save();

    await updateDestinationRating(comment.destination);

    res.status(200).json({ message: "Comment updated", comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteDestinationComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await DestinationComment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    await DestinationComment.findByIdAndDelete(commentId);

    await updateDestinationRating(comment.destination);

    res.status(200).json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCommentsForDestination = async (req, res) => {
  try {
    const { destinationId } = req.params;

    const comments = await DestinationComment.find({ destination: destinationId })
      .populate("user", "username avatar")
      .populate("review", "_id");

    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
