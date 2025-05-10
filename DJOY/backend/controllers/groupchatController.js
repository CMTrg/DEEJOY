import GroupChat from "../models/groupchatModel.js";
import Destination from "../models/destinationModel.js";


import GroupChat from "../models/groupchatModel.js";

export const createGroupChat = async (req, res) => {
    try {
      const { members, name, isGroup } = req.body;
      const creatorId = req.user._id; 

      if (!members || members.length < 1) {
        return res.status(400).json({ message: "At least one member is required." });
      }

      if (!isGroup) {
        const existingChat = await GroupChat.findOne({
          isGroup: false,
          members: { $all: [creatorId, members[0]], $size: 2 },
        });

        if (existingChat) return res.status(200).json(existingChat);

        const chat = new GroupChat({
          members: [creatorId, members[0]],
          isGroup: false,
          messages: [],
          todoLists: [],
        });

        await chat.save();
        return res.status(201).json(chat);
      }

      if (!name || members.length < 2) {
        return res.status(400).json({ message: "A group chat requires a name and at least two members." });
      }

      const groupChat = new GroupChat({
        name,
        members: [...members, creatorId],
        isGroup: true,
        admin: creatorId,
        messages: [],
        todoLists: [],
      });

      await groupChat.save();
      res.status(201).json(groupChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const addMemberToGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    if (new Set(groupChat.members.map(String)).has(userId)) {
      return res.status(400).json({ message: "User is already in the group." });
    }

    groupChat.members.push(userId);
    await groupChat.save();

    res.status(200).json({ message: "Member added to the group." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const leaveGroupChat = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    groupChat.members = groupChat.members.filter(
      member => member.toString() !== userId
    );

    groupChat.admin = groupChat.admin.filter(
      admin => admin.toString() !== userId
    );

    if (groupChat.members.length === 0) {
      await GroupChat.findByIdAndDelete(groupId);
      return res.status(200).json({ message: "Group deleted as it has no members left." });
    }

    if (groupChat.admin.length === 0 && groupChat.members.length > 0) {
      groupChat.admin.push(groupChat.members[0]);
    }

    await groupChat.save();

    res.status(200).json({ message: "Left the group chat successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { groupId, userId } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    groupChat.members = groupChat.members.filter(member => member.toString() !== userId);
    if (groupChat.members.length === 0) {
      await GroupChat.findByIdAndDelete(groupId);
      return res.status(200).json({ message: "Group deleted as it has no members left." });
    }

    await groupChat.save();

    res.status(200).json({ message: "Member removed from the group." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { groupId, senderId, text } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }
    if (!groupChat.members.some(member => member.toString() === senderId)) {
      return res.status(403).json({ message: "User is not a member of this group." });
    }

    const newMessage = { sender: senderId, text, timestamp: new Date() };
    groupChat.messages.push(newMessage);
    await groupChat.save();

    res.status(201).json({ message: "Message sent.", newMessage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { groupId } = req.params;

    const groupChat = await GroupChat.findById(groupId).populate("messages.sender");
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    res.status(200).json(groupChat.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const createTodoList = async (req, res) => {
  try {
    const { groupId, title } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    groupChat.todoLists.push({ title, destinations: [] });
    await groupChat.save();

    res.status(201).json({ message: "To-do list created.", todoLists: groupChat.todoLists });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addDestinationToTodoList = async (req, res) => {
  try {
    const { groupId, todoIndex, destinationId, date, startTime, endTime } = req.body;

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    if (!groupChat.todoLists[todoIndex]) {
      return res.status(400).json({ message: "Invalid to-do list index." });
    }

    const alreadyShared = groupChat.todoLists[todoIndex].destinations.some(
      (dest) => dest.fsqId === destinationId
    );

    if (!alreadyShared) {
      groupChat.todoLists[todoIndex].destinations.push({
        fsqId: destinationId,
        yesVotes: [],
        noVotes: [],
        date,
        startTime,
        endTime
      });

      await Destination.findByIdAndUpdate(destinationId, { $inc: { sharedCount: 1 } });
    }

    await groupChat.save();
    res.status(201).json({ message: "Destination added to to-do list." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const voteForDestination = async (req, res) => {
  try {
    const { groupId, todoIndex, destinationIndex, userId, voteType } = req.body; 

    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    if (todoIndex < 0 || todoIndex >= groupChat.todoLists.length) {
      return res.status(400).json({ message: "Invalid to-do list index." });
    }

    const todoList = groupChat.todoLists[todoIndex];

    if (destinationIndex < 0 || destinationIndex >= todoList.destinations.length) {
      return res.status(400).json({ message: "Invalid destination index." });
    }

    const destination = todoList.destinations[destinationIndex];

    const yesVotes = new Set(destination.yesVotes.map(id => id.toString()));
    const noVotes = new Set(destination.noVotes.map(id => id.toString()));

    yesVotes.delete(userId);
    noVotes.delete(userId);

    if (voteType === "yes") {
      yesVotes.add(userId);
    } else if (voteType === "no") {
      noVotes.add(userId);
    } else {
      return res.status(400).json({ message: "Invalid vote type. Use 'yes' or 'no'." });
    }

    destination.yesVotes = Array.from(yesVotes);
    destination.noVotes = Array.from(noVotes);

    await groupChat.save();

    const totalVotes = new Set([...destination.yesVotes, ...destination.noVotes]).size;
    if (totalVotes === groupChat.members.length) {
      await removeUnpopularDestinations(groupId, todoIndex);
    }

    res.status(200).json({ message: `Vote '${voteType}' added.`, updatedDestination: destination });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const removeUnpopularDestinations = async (groupId, todoIndex) => {
  try {
    const groupChat = await GroupChat.findById(groupId);
    if (!groupChat) return;

    groupChat.todoLists[todoIndex].destinations = groupChat.todoLists[todoIndex].destinations.filter(destination =>
      destination.yesVotes.length > destination.noVotes.length
    );

    await groupChat.save();
    console.log(`Unpopular destinations removed for Group ${groupId}`);
  } catch (error) {
    console.error("Error removing unpopular destinations:", error);
  }
};

export const getGroupChat = async (req, res) => {
  try {
    const { groupId } = req.params;

    const groupChat = await GroupChat.findById(groupId)
      .populate("members")
      .populate("messages.sender")
      .populate("todoLists.destinations.destination");

    if (!groupChat) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    res.status(200).json(groupChat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteGroupChat = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user.userId; 

    const group = await GroupChat.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group chat not found." });
    }

    if (!group.admin.map(id => id.toString()).includes(userId)) {
      return res.status(403).json({ message: "Only the group creator can delete this chat." });
    }

    await group.deleteOne();
    res.status(200).json({ message: "Group chat deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
