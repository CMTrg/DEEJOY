import mongoose from "mongoose";

const GroupChatSchema = new mongoose.Schema({
    name: String,
    isGroup: { type: Boolean, default: true }, 
    admin: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }],
    todoLists: [{
      title: String,
      destinations: [{
        fsqId: { type: String, required: true },
        yesVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        noVotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        date: Date,
        startTime: String,
        endTime: String
      }]
    }]
  });


const groupchatModel = mongoose.models.GroupChat || mongoose.model("GroupChat", GroupChatSchema);

export default groupchatModel;
  