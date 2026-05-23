const mongoose = require("mongoose");

const Message = require("../models/Message");
const BuddyRequest = require("../models/BuddyRequest");

const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({
        message:
          "receiverId and text are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        receiverId
      )
    ) {
      return res.status(400).json({
        message: "Invalid receiverId",
      });
    }

    const cleanText = text.trim();

    if (!cleanText) {
      return res.status(400).json({
        message:
          "Message cannot be empty",
      });
    }

    const acceptedRequest =
      await BuddyRequest.findOne({
        status: "accepted",
        $or: [
          {
            sender: req.user._id,
            receiver: receiverId,
          },
          {
            sender: receiverId,
            receiver: req.user._id,
          },
        ],
      });

    if (!acceptedRequest) {
      return res.status(403).json({
        message:
          "You can only chat after request is accepted",
      });
    }

    const message =
      await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        text: cleanText,
      });

    const populatedMessage =
      await Message.findById(
        message._id
      )
        .populate(
          "sender",
          "name email profileImage"
        )
        .populate(
          "receiver",
          "name email profileImage"
        );

    res.status(201).json({
      message:
        "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.log(
      "SEND MESSAGE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMessages = async (req, res) => {
  try {
    const otherUserId =
      req.params.userId;

    if (
      !mongoose.Types.ObjectId.isValid(
        otherUserId
      )
    ) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const acceptedRequest =
      await BuddyRequest.findOne({
        status: "accepted",
        $or: [
          {
            sender: req.user._id,
            receiver: otherUserId,
          },
          {
            sender: otherUserId,
            receiver: req.user._id,
          },
        ],
      });

    if (!acceptedRequest) {
      return res.status(403).json({
        message:
          "You can only view chat after request is accepted",
      });
    }

    const messages =
      await Message.find({
        $or: [
          {
            sender: req.user._id,
            receiver: otherUserId,
          },
          {
            sender: otherUserId,
            receiver: req.user._id,
          },
        ],
      })
        .populate(
          "sender",
          "name email profileImage"
        )
        .populate(
          "receiver",
          "name email profileImage"
        )
        .sort({ createdAt: 1 });

    res.status(200).json({
      message:
        "Messages fetched successfully",
      messages,
    });
  } catch (error) {
    console.log(
      "GET MESSAGE ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteMessage = async (
  req,
  res
) => {
  try {
    const message =
      await Message.findById(
        req.params.id
      );

    if (!message) {
      return res.status(404).json({
        message: "Message not found",
      });
    }

    if (
      message.sender.toString() !==
      req.user._id.toString()
    ) {
      return res.status(401).json({
        message: "Not authorized",
      });
    }

    await message.deleteOne();

    res.status(200).json({
      message:
        "Message deleted successfully",
    });
  } catch (error) {
    console.log(
      "DELETE MESSAGE ERROR:",
      error
    );

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