import FriendList from "../models/friendListModel.js";

import FriendList from "../models/friendListModel.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    if (userId === friendId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    let userFriendList = await FriendList.findOne({ user: userId });
    if (!userFriendList) {
      userFriendList = new FriendList({ user: userId, friends: [] });
    }

    const existingRequest = userFriendList.friends.find(
      (friend) => friend.user.equals(friendId)
    );

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent or already friends" });
    }

    userFriendList.friends.push({ user: friendId, status: "pending" });
    await userFriendList.save();

    let friendFriendList = await FriendList.findOne({ user: friendId });
    if (!friendFriendList) {
      friendFriendList = new FriendList({ user: friendId, friends: [] });
    }
    friendFriendList.friends.push({ user: userId, status: "incoming" });
    await friendFriendList.save();

    res.status(201).json({ message: "Friend request sent" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const acceptFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    let userFriendList = await FriendList.findOne({ user: userId });
    if (!userFriendList) {
      return res.status(404).json({ message: "Friend list not found" });
    }

    const friendRequest = userFriendList.friends.find(
      (friend) => friend.user.equals(friendId) && friend.status === "pending"
    );

    if (!friendRequest) {
      return res.status(400).json({ message: "No pending friend request found" });
    }

    friendRequest.status = "accepted";
    await userFriendList.save();

    let friendList = await FriendList.findOne({ user: friendId });
    if (!friendList) {
      friendList = new FriendList({ user: friendId, friends: [] });
    }

    const existing = friendList.friends.find(f => f.user.equals(userId));
    if (!existing) {
      friendList.friends.push({ user: userId, status: "accepted" });
    } else {
      existing.status = "accepted";
    }

    await friendList.save();

    res.status(200).json({ message: "Friend request accepted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    let userFriendList = await FriendList.findOne({ user: userId });
    if (!userFriendList) {
      return res.status(404).json({ message: "Friend list not found" });
    }

    const initialLength = userFriendList.friends.length;
    userFriendList.friends = userFriendList.friends.filter(
      (friend) => !(friend.user.equals(friendId) && friend.status === "pending")
    );

    if (initialLength === userFriendList.friends.length) {
      return res.status(400).json({ message: "No pending friend request found" });
    }

    await userFriendList.save();

    res.status(200).json({ message: "Friend request declined" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectIncomingFriendRequest = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    const senderFriendList = await FriendList.findOne({ user: friendId });

    if (!senderFriendList) {
      return res.status(404).json({ message: "Sender's friend list not found" });
    }

    const initialLength = senderFriendList.friends.length;
    senderFriendList.friends = senderFriendList.friends.filter(
      (friend) => !(friend.user.equals(userId) && friend.status === "pending")
    );

    if (initialLength === senderFriendList.friends.length) {
      return res.status(400).json({ message: "No incoming friend request found" });
    }

    await senderFriendList.save();

    res.status(200).json({ message: "Incoming friend request rejected" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Remove a friend (Unfriend)
 */
export const removeFriend = async (req, res) => {
  try {
    const { userId, friendId } = req.body;

    let userFriendList = await FriendList.findOne({ user: userId });
    if (!userFriendList) {
      return res.status(404).json({ message: "Friend list not found" });
    }

    const initialLength = userFriendList.friends.length;
    userFriendList.friends = userFriendList.friends.filter(
      (friend) => !friend.user.equals(friendId)
    );

    if (initialLength === userFriendList.friends.length) {
      return res.status(400).json({ message: "Friend not found in your list" });
    }

    await userFriendList.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get a user's friends list
 */
export const getAcceptedFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendList = await FriendList.findOne({ user: userId }).populate("friends.user", "name email");

    if (!friendList) {
      return res.status(404).json({ message: "Friend list not found" });
    }

    const acceptedFriends = friendList.friends.filter(friend => friend.status === "accepted");

    res.status(200).json(acceptedFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPendingFriends = async (req, res) => {
  try {
    const { userId } = req.params;

    const friendList = await FriendList.findOne({ user: userId }).populate("friends.user", "name email");

    if (!friendList) {
      return res.status(404).json({ message: "Friend list not found" });
    }

    const pendingFriends = friendList.friends.filter(friend => friend.status === "pending");

    res.status(200).json(pendingFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIncomingFriendRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const incomingRequests = await FriendList.find({
      "friends": {
        $elemMatch: { user: userId, status: "pending" }
      }
    }).populate("user", "name email");

    const senders = incomingRequests.map(req => ({
      senderId: req.user._id,
      name: req.user.name,
      email: req.user.email
    }));

    res.status(200).json(senders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
