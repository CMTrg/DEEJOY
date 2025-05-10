import mongoose from "mongoose";

const FavoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  destinations: [{ type: String }]
}, { timestamps: true });

const favoriteModel = mongoose.models.Favorite || mongoose.model("Favorite", FavoriteSchema);

export default favoriteModel;
  