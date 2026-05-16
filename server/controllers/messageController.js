const Message = require("../models/Message");
const BuddyRequest = require("../models/BuddyRequest");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({
        message: "receiverId and text are required",
      });
    }

    const acceptedRequest = await BuddyRequest.findOne({
      status: "accepted",
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    });

    if (!acceptedRequest) {
      return res.status(403).json({
        message: "You can only chat after request is accepted",
      });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
    });

    res.status(201).json({
      message: "Message sent successfully",
      data: message,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const acceptedRequest = await BuddyRequest.findOne({
      status: "accepted",
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    });

    if (!acceptedRequest) {
      return res.status(403).json({
        message: "You can only view chat after request is accepted",
      });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    // sirf sender hi delete kar sake
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await message.deleteOne();

    res.status(200).json({
      message: "Message deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  deleteMessage,
};