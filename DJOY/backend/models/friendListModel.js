import mongoose from "mongoose";

const FriendListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  friends: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" }
  }]   
}, { timestamps: true });

const friendListModel = mongoose.models.FriendList || mongoose.model("FriendList", FriendListSchema);

export default friendListModel;
