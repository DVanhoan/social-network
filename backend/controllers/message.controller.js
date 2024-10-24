import Notification from "../models/notification.model.js";

const sendMessage = async (conversationId, senderId, content) => {
  const message = new Message({
    conversationId,
    sender: senderId,
    content,
  });
  await message.save();

  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
  });

  return message;
};
