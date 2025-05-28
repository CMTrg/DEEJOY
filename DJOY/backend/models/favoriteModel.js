import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: "Destination", required: true },
}, { timestamps: true });


const favoriteModel = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

export default favoriteModel;
  