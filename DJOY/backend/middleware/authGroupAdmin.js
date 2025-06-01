import GroupChat from "../models/groupchatModel.js";

export const authorizeGroupAdmin = async (req, res, next) => {
  try {
    const groupId = req.params.groupId || req.body.groupId;
    const group = await GroupChat.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    const isAdmin = group.admin.some(
      (adminId) => adminId.toString() === req.user.userId
    );

    if (!isAdmin) {
      return res.status(403).json({ message: "Only the group creator can perform this action" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};