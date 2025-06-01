import mongoose from "mongoose";

const DestinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  foursquareId: { type: String, unique: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  category: { type: String, required: true },
  rating: { type: Number, default: 0 }, 
  images: [{ type: String }],
  isFeatured: { type: Boolean, default: false },

  searchCount: { type: Number, default: 0 },   
  reviewCount: { type: Number, default: 0 },
  sharedCount: { type: Number, default: 0 },   
  favoritesCount: { type: Number, default: 0 }, 
  trendingScore: { type: Number, default: 0 }, 
}, { timestamps: true });

const destinationModel = mongoose.models.Destination || mongoose.model("Destination", DestinationSchema);

export default destinationModel;
