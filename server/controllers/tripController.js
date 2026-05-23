const mongoose = require("mongoose");
const Trip = require("../models/Trip");
const BuddyRequest = require("../models/BuddyRequest");

const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelType, description } =
      req.body;

    if (!destination || !startDate || !endDate || !budget || !travelType) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid start or end date",
      });
    }

    if (end < start) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate: start,
      endDate: end,
      budget: Number(budget),
      travelType,
      description: description || "",
    });

    return res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    console.log("CREATE TRIP ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate("user", "name email city profileImage")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "All trips fetched successfully",
      trips,
    });
  } catch (error) {
    console.log("GET ALL TRIPS ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "My trips fetched successfully",
      trips,
    });
  } catch (error) {
    console.log("GET MY TRIPS ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getTripById = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({
        message: "Invalid trip id",
      });
    }

    const trip = await Trip.findById(tripId).populate(
      "user",
      "name email city profileImage"
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    return res.status(200).json({
      message: "Trip fetched successfully",
      trip,
    });
  } catch (error) {
    console.log("GET TRIP BY ID ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const updateTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({
        message: "Invalid trip id",
      });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this trip",
      });
    }

    const allowedUpdates = [
      "destination",
      "startDate",
      "endDate",
      "budget",
      "travelType",
      "description",
      "tripImage",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        trip[field] = field === "budget" ? Number(req.body[field]) : req.body[field];
      }
    });

    if (trip.startDate && trip.endDate && trip.endDate < trip.startDate) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }

    const updatedTrip = await trip.save();

    return res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    console.log("UPDATE TRIP ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteTrip = async (req, res) => {
  try {
    const tripId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({
        message: "Invalid trip id",
      });
    }

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this trip",
      });
    }

    await BuddyRequest.deleteMany({ trip: trip._id });

    await trip.deleteOne();

    return res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    console.log("DELETE TRIP ERROR:", error);

    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
};