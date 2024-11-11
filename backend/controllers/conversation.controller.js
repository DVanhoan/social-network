import Conversation from "../models/conversation.model.js";

export const createConversation = async (req, res) => {
  try {
    const { participants, groupName, isGroup, createdBy } = req.body;

    if (participants.length < 2) {
      return res
        .status(400)
        .json({ error: "Conversation must have at least 2 participants" });
    }

    if (isGroup) {
      const conversation = new Conversation({
        participants,
        groupName,
        isGroup,
        createdBy,
      });
      await conversation.save();
      res.status(201).json(conversation);
      return;
    }

    const conversation = new Conversation({
      participants,
      isGroup,
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    console.log("Error in createConversation controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//get all conversations of a user
export const getConversations = async (req, res) => {
  try {
    const { userId } = req.user.id;
    const conversations = await Conversation.find({
      participants: { $in: [userId] },
    })
      .populate("lastMessage")
      .populate("participants")
      .exec();

    res.status(200).json(conversations);
  } catch (error) {
    console.log("Error in getConversations controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getConversation = async (req, res) => {
  try {
    const { userId, friendId } = req.params;
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, friendId] },
      isGroup: false,
    });
    res.status(200).json(conversation);
  } catch (error) {
    console.log("Error in getConversation controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLastMessage = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const lastMessage = await Conversation.findOne({
      _id: conversationId,
    })
      .populate("lastMessage")
      .populate("participants")
      .exec();
    res.status(200).json(lastMessage);
  } catch (error) {
    console.log("Error in getLastMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
