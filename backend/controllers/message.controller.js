import Notification from "../models/notification.model.js";
import { v2 as cloudinary } from "cloudinary";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
  try {
    const { content, conversationId, img } = req.body;
    const sender = req.user._id;

    if (!content && !img) {
      return res
        .status(400)
        .json({ error: "Message must have content or image" });
    }

    if (img) {
      const uploadedResponse = await cloudinary.uploader.upload(img);
      img = uploadedResponse.secure_url;
    }

    const message = new Message({
      content,
      sender,
      conversationId,
      sentAt: Date.now(),
    });

    const newNotification = Notification.create({
      from: sender,
      to: conversationId,
      type: "message",
      read: false,
      messageId: message._id,
    });

    await newNotification.save();
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ error: "You are not authorized to delete this message" });
    }

    await Message.findByIdAndDelete(messageId);

    const notification = await Notification.findOne({
      messageId,
    });
    if (notification) {
      notification.read = true;
      await notification.save();
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log("Error in deleteMessage controller: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const readMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const notification = await Notification.findOne({
      messageId,
    });
    if (notification) {
      notification.read = true;
      await notification.save();
    } else {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ message: "Message read successfully" });
  } catch (error) {
    console.log("Error in readMessage controller: ", error);
  }
};
