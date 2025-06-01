import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  text: { type: String, required: true },
  image: { type: String }, 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], 
  timestamp: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true }, 
  rating: { type: Number, required: true }, 
  comment: String,
  images: [{ type: String }], 
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  sharedCount: { type: Number, default: 0 } 
}, { timestamps: true });

const commentModel = mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
const reviewModel = mongoose.models.Review || mongoose.model("Review", ReviewSchema);

export { commentModel, reviewModel };
