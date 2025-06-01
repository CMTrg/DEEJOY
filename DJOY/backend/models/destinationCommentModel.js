import mongoose from "mongoose";

const DestinationCommentSchema = new mongoose.Schema({
  destination: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5 },
  image: { type: String },
  review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" }, 
}, { timestamps: true });

const destinationCommentModel = mongoose.models.DestinationComment || mongoose.model("DestinationComment", DestinationCommentSchema);

export default destinationCommentModel;