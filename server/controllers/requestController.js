const BuddyRequest = require("../models/BuddyRequest");

// Send request
const sendRequest = async (req, res) => {
  try {
    const { receiverId, tripId } = req.body;

    if (!receiverId || !tripId) {
      return res.status(400).json({
        message: "receiverId and tripId are required",
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
    });

    res.status(201).json({
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get received requests
const getReceivedRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      receiver: req.user._id,
    })
      .populate("sender", "name email")
      .populate("trip", "destination startDate endDate");

    res.status(200).json({
      message: "Received requests fetched successfully",
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Get sent requests
const getSentRequests = async (req, res) => {
  try {
    const requests = await BuddyRequest.find({
      sender: req.user._id,
    })
      .populate("receiver", "name email")
      .populate("trip", "destination startDate endDate");

    res.status(200).json({
      message: "Sent requests fetched successfully",
      requests,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Accept request
const acceptRequest = async (req, res) => {
  try {
    const request = await BuddyRequest.findById(req.params.id);

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

    res.status(200).json({
      message: "Request accepted successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Reject request
const rejectRequest = async (req, res) => {
  try {
    const request = await BuddyRequest.findById(req.params.id);

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

    res.status(200).json({
      message: "Request rejected successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({
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