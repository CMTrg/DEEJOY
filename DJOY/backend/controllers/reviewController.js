import { reviewModel as Review, commentModel as Comment } from "../models/reviewModel.js";
import axios from "axios";
import Destination from "../models/destinationModel.js"
import dotenv from "dotenv";
dotenv.config();

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;


export const addReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { fsqId, rating, comment } = req.body;

    if (!fsqId) {
      return res.status(400).json({ message: "Foursquare ID is required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required for the review" });
    }

    let destination = await Destination.findOne({ foursquareId: fsqId });

    if (!destination) {
      try {
        const detailRes = await axios.get(`https://api.foursquare.com/v3/places/${fsqId}`, {
          headers: {
            Authorization: FOURSQUARE_API_KEY
          }
        });

        const place = detailRes.data;
        const geo = place.geocodes?.main;
        const address = place.location?.formatted_address || place.location?.address || "Address unavailable";

        if (!geo || typeof geo.latitude !== "number" || typeof geo.longitude !== "number") {
          return res.status(400).json({ message: "Invalid location data from Foursquare" });
        }

        let images = [];
        try {
          const photoRes = await axios.get(`https://api.foursquare.com/v3/places/${fsqId}/photos`, {
            headers: {
              Authorization: FOURSQUARE_API_KEY
            },
            params: {
              limit: 5
            }
          });

          images = photoRes.data.map(p => `${p.prefix}original${p.suffix}`);
        } catch (photoErr) {
          console.warn(`Failed to fetch photos for ${place.name}: ${photoErr.message}`);
        }

        destination = new Destination({
          name: place.name,
          foursquareId: fsqId,
          location: {
            lat: geo.latitude,
            lng: geo.longitude
          },
          address,
          category: place.categories?.[0]?.name || "Unknown",
          images,
          rating,
          reviewCount: 1,
          searchCount: 0,
          sharedCount: 0,
          favoritesCount: 0,
          trendingScore: 0,
          isFeatured: false
        });

        await destination.save();
      } catch (err) {
        console.error("Foursquare fetch error:", err.message);
        return res.status(500).json({ message: "Failed to fetch or save destination" });
      }
    } else {
      destination.reviewCount += 1;
    }

    const uploadedImages = req.files.map(file => file.path);

    const newReview = new Review({
      user: userId,
      destination: destination._id,
      rating,
      comment,
      images: uploadedImages,
      sharedCount: 0
    });

    await newReview.save();

    const allReviews = await Review.find({ destination: destination._id });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalRating / allReviews.length;

    destination.rating = avgRating;
    await destination.save();

    res.status(201).json({
      message: "Review added successfully",
      review: newReview,
      updatedDestination: {
        name: destination.name,
        rating: destination.rating,
        reviewCount: destination.reviewCount
      }
    });
  } catch (error) {
    console.error("Add review error:", error.message);
    res.status(500).json({ message: "Something went wrong while adding the review" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture")           
      .populate("destination", "name rating category");      
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    await Comment.deleteMany({ _id: { $in: review.comments } });
    await Review.findByIdAndDelete(reviewId);

    const destination = await Destination.findById(review.destination);
    if (destination) {
      const allReviews = await Review.find({ destination: destination._id });
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      destination.reviewCount = allReviews.length;
      destination.rating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
      await destination.save();
    }

    res.status(200).json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
    try {
      const { commentId } = req.params;

      const comment = await Comment.findById(commentId);
      if (!comment) return res.status(404).json({ message: "Comment not found" });

      const review = await Review.findById(comment.review);
      if (!review) return res.status(404).json({ message: "Associated review not found" });

      review.comments = review.comments.filter(
        (id) => id.toString() !== commentId
      );
      await review.save();

      await Comment.findByIdAndDelete(commentId);

      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


export const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, images } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (rating !== undefined) {
      const parsedRating = Number(rating);
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        return res.status(400).json({ message: "Rating must be a number between 1 and 5" });
      }
      review.rating = parsedRating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    if (images !== undefined) {
      review.images = images;
    }

    await review.save();

    if (rating !== undefined) {
      const destination = await Destination.findById(review.destination);
      if (destination) {
        const allReviews = await Review.find({ destination: destination._id });
        const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
        destination.rating = totalRating / allReviews.length;
        await destination.save();
      }
    }

    res.status(200).json(review);
  } catch (error) {
    console.error("Error editing review:", error);
    res.status(500).json({ message: "Server error while editing review" });
  }
};

export const editComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { text, image } = req.body;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    comment.text = text || comment.text;
    comment.image = image !== undefined ? image : comment.image;

    await comment.save();

    res.status(200).json({ message: "Comment updated", comment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const addCommentToReview = async (req, res) => {
  try {
    const { text } = req.body;
    const { reviewId } = req.params;
    const userId = req.user.userId;

    console.log("Review ID:", reviewId);
    console.log("Text:", text);
    console.log("File:", req.file);

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const imageUrl = req.file ? req.file.path : null;

    const newComment = new Comment({
      user: userId,
      text,
      image: imageUrl,
    });

    await newComment.save();
    review.comments.push(newComment._id);
    await review.save();

    res.status(201).json({ message: "Comment added", comment: newComment });
  } catch (error) {
    console.error("Add comment error:", error); // ✅ Log the error
    res.status(500).json({ message: error.message });
  }
};


export const getCommentsForReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId).populate({
      path: "comments",
      populate: { path: "user", select: "username profilePicture" }
    });

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json(review.comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLikeReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const alreadyLiked = review.likes.includes(userId);

    if (alreadyLiked) {
      review.likes = review.likes.filter(id => id.toString() !== userId);
    } else {
      review.likes.push(userId);
    }

    await review.save();

    res.status(200).json({
      message: alreadyLiked ? "Review unliked" : "Review liked",
      likesCount: review.likes.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLikeComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;

    console.log("userId:", userId, "commentId:", commentId);

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const alreadyLiked = comment.likes.some(id => id.toString() === userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.status(200).json({
      message: alreadyLiked ? "Comment unliked" : "Comment liked",
      likesCount: comment.likes.length
    });
  } catch (err) {
    console.error("Error in toggleLikeComment:", err);
    res.status(500).json({ message: err.message });
  }
};


export const replyToComment = async (req, res) => {
  try {
    const { text } = req.body;
    const { commentId } = req.params;
    const userId = req.user.userId;

    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ message: "Parent comment not found" });

    const replyComment = new Comment({ user: userId, text });
    await replyComment.save();

    parentComment.replies.push(replyComment._id);
    await parentComment.save();

    res.status(201).json({ message: "Reply added", reply: replyComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewLikes = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId).populate("likes", "username profilePicture");
    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json({ likes: review.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCommentLikes = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId).populate("likes", "username profilePicture");
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    res.status(200).json({ likes: comment.likes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getReviewWithComment = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId)
      .populate("user", "username profilePic")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profilePic"
        }
      });

    if (!review) return res.status(404).json({ message: "Review not found" });

    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchReviews = async (req, res) => {
  try {
    const { keyword } = req.query;
    const regex = new RegExp(keyword, "i"); 

    const reviews = await Review.find({
      comment: { $regex: regex }
    })
      .populate("user", "username profilePic")
      .populate("comments");

    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  
export const incrementReviewShareCount = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.sharedCount += 1;
    await review.save();

    res.status(200).json({ message: "Share count incremented", sharedCount: review.sharedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const hasUserLikedReview = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    const liked = review.likes.includes(userId);

    res.status(200).json({ liked });
  } catch (error) {
    console.error("Error checking like status:", error);
    res.status(500).json({ message: "Server error checking like status" });
  }
};

export const alreadyLikedComment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    const liked = comment.likes.some(id => id.toString() === userId);

    res.status(200).json({ alreadyLiked: liked });
  } catch (err) {
    console.error("Error in alreadyLikedComment:", err);
    res.status(500).json({ message: err.message });
  }
};