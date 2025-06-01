import mongoose from "mongoose";

const UserPreferenceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  preferences: [{
    category: String, 
    priority: { type: Number, min: 1, max: 5 } 
  }]
}, { timestamps: true });

const userPreferenceModel = mongoose.models.UserPreference || mongoose.model("UserPreference", UserPreferenceSchema);

export default userPreferenceModel;
