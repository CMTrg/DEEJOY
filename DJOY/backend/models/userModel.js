import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  profilePicture: { type: String }, 
  role: { 
    type: String, 
    enum: ["admin", "customer", "collaborator"], 
    default: "customer" 
  }, 
  isActive: {
    type: Boolean,
    default: false 
  },
  verifyToken: {
    type: String 
  },
  createdAt: { type: Date, default: Date.now }
});

const userModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default userModel;
