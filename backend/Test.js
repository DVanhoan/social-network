// Tạo cuộc trò chuyện mới
const createConversation = async (
  isGroupChat,
  participants,
  groupName = null
) => {
  const conversation = new Conversation({
    participants,
    isGroupChat,
    groupName: isGroupChat ? groupName : null,
  });
  await conversation.save();
  return conversation;
};

//tạo nhóm
const createGroup = async (groupName, creatorId, participants) => {
  const group = new Conversation({
    participants: [creatorId, ...participants], // Bao gồm người tạo trong participants
    isGroup: true,
    groupName,
    createdBy: creatorId, // Lưu người tạo nhóm
  });

  await group.save();
  return group;
};

//gửi tin nhắn
const sendMessage = async (conversationId, senderId, content) => {
  const message = new Message({
    conversationId,
    sender: senderId,
    content,
  });
  await message.save();

  // Cập nhật tin nhắn cuối cùng trong cuộc trò chuyện
  await Conversation.findByIdAndUpdate(conversationId, {
    lastMessage: message._id,
  });

  return message;
};

//lấy danh sách cuộc trò chuyện
const userConversations = await Conversation.find({
  participants: userId,
}).populate("lastMessage");

//mời tham gia nhóm
const inviteUserToGroup = async (groupId, fromUserId, toUserId) => {
  const groupRequest = new GroupRequest({
    groupId,
    requestType: "invite",
    from: fromUserId, // Người mời
    to: toUserId, // Người được mời
  });
  await groupRequest.save();
  return groupRequest;
};

//Người dùng chấp nhận hoặc từ chối lời mời
const respondToInvite = async (requestId, response) => {
  const request = await GroupRequest.findById(requestId);

  if (response === "accept") {
    request.status = "accepted";
    // Thêm người dùng vào nhóm
    await Conversation.findByIdAndUpdate(request.groupId, {
      $addToSet: { participants: request.to },
    });
  } else if (response === "decline") {
    request.status = "declined";
  }

  await request.save();
  return request;
};

//người dùng yêu cầu tham gia nhóm
const requestToJoinGroup = async (groupId, userId) => {
  const group = await Conversation.findById(groupId);
  if (!group || !group.isGroup) {
    throw new Error("Group not found");
  }

  const groupRequest = new GroupRequest({
    groupId,
    requestType: "request",
    from: userId, // Người gửi yêu cầu
    to: group.createdBy, // Gửi yêu cầu tới người tạo nhóm (admin)
  });

  await groupRequest.save();
  return groupRequest;
};

//trưởng nhóm phê duyệt
const respondToJoinRequest = async (requestId, response) => {
  const request = await GroupRequest.findById(requestId);
  if (!request) {
    throw new Error("Request not found");
  }

  if (response === "accept") {
    request.status = "accepted";
    // Thêm người dùng vào nhóm
    await Conversation.findByIdAndUpdate(request.groupId, {
      $addToSet: { participants: request.from },
    });
  } else if (response === "decline") {
    request.status = "declined";
  }

  await request.save();
  return request;
};
