import Favorite from "../models/favoriteModel.js";

export const addFavorite = async (req, res) => {
  try {
    const { userId, destinationId } = req.body;
    const existingFavorite = await Favorite.findOne({ userId, destinationId });
    if (existingFavorite) {
      return res.status(400).json({ message: "Already in favorites" });
    }
    const favorite = new Favorite({ userId, destinationId });
    await favorite.save();
    await Destination.findByIdAndUpdate(destinationId, { $inc: { favoritesCount: 1 } });
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const { userId, destinationId } = req.body;
    const favorite = await Favorite.findOneAndDelete({ userId, destinationId });
    if (!favorite) {
      return res.status(404).json({ message: "Favorite not found" });
    }
    await Destination.findByIdAndUpdate(destinationId, { $inc: { favoritesCount: -1 } });
    res.status(200).json({ message: "Removed from favorites" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserFavorites = async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId }).populate("destinationId");
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
