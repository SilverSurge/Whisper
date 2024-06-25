import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

// logic for sending message
export const sendMessage = async (req, res) => {
  try {
    // get the message details
    const senderId = req.id; // from authentication middleware
    const receiverId = req.params.id;
    const { message } = req.body;

    // retrieve the conversation
    let gotConversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    // if no conversation prior, then create a new conversation
    if (!gotConversation) {
      gotConversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    // create a new message and append the id to the message list
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }
    // await gotConversation.save();
    // await newMessage.save();
    await Promise.all([gotConversation.save(), newMessage.save()]);

    // SOCKET IO [PENDING]

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    return res.status(201).json({
      message: "message sent successfully",
      newMessage,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getMessage = async (req, res) => {
  try {
    // get conversation details
    const receiverId = req.params.id;
    const senderId = req.id;
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");
    // messages is initially a list of ids
    // the populate method, fetch the complete messages from the ids

    return res.status(200).json(conversation?.messages);
  } catch (error) {
    console.log(error);
  }
};
