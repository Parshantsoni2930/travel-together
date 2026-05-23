const mongoose = require("mongoose");
const BuddyRequest = require("../models/BuddyRequest");
const Trip = require("../models/Trip");
const User = require("../models/User");

const sendRequest = async (req, res) => {
  try {
    const { receiverId, tripId } = req.body;

    if (!receiverId || !tripId) {
      return res.status(400).json({
        message: "receiverId and tripId are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(receiverId) ||
      !mongoose.Types.ObjectId.isValid(tripId)
    ) {
      return res.status(400).json({
        message: "Invalid receiverId or tripId",
      });
    }

    if (receiverId.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot send request to your own trip",
      });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        message: "Receiver user not found",
      });
    }

    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.user.toString() !== receiverId.toString()) {
      return res.status(400).json({
        message: "Receiver does not own this trip",
      });
    }

    const existingRequest = await BuddyRequest.findOne({
      sender: req.user._id,
      receiver: receiverId,
      trip: tripId,
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    const request = await BuddyRequest.create({
      sender: req.user._id,
      receiver: receiverId,
      trip: tripId,
      status: "pending",
    });

    return res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    console.log("SEND REQUEST ERROR:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Request already sent",
      });
    }

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getReceivedRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      receiver: req.user._id,
    })
      .populate("sender", "name email profileImage city")
      .populate("trip", "destination startDate endDate budget travelType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Received requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.log("GET RECEIVED REQUESTS ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getSentRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      sender: req.user._id,
    })
      .populate("receiver", "name email profileImage city")
      .populate("trip", "destination startDate endDate budget travelType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Sent requests fetched successfully",
      requests,
    });
  } catch (error) {
    console.log("GET SENT REQUESTS ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const acceptRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }

    const request = await BuddyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to accept this request",
      });
    }

    request.status = "accepted";
    await request.save();

    return res.status(200).json({
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    console.log("ACCEPT REQUEST ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const rejectRequest = async (req, res) => {
  try {
    const requestId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        message: "Invalid request id",
      });
    }

    const request = await BuddyRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to reject this request",
      });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.log("REJECT REQUEST ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
};