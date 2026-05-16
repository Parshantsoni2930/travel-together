const Trip = require("../models/Trip");

const createTrip = async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelType, description } =
      req.body;

    if (!destination || !startDate || !endDate || !budget || !travelType) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const trip = await Trip.create({
      user: req.user._id,
      destination,
      startDate,
      endDate,
      budget,
      travelType,
      description,
    });

    res.status(201).json({
      message: "Trip created successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("user", "name email city profileImage");

    res.status(200).json({
      message: "All trips fetched successfully",
      trips,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id });

    res.status(200).json({
      message: "My trips fetched successfully",
      trips,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};





// GET single trip
const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    res.status(200).json({
      message: "Trip fetched successfully",
      trip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE trip
const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // check ownership
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to update this trip",
      });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json({
      message: "Trip updated successfully",
      trip: updatedTrip,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// DELETE trip
const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found",
      });
    }

    // check ownership
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized to delete this trip",
      });
    }

    await trip.deleteOne();

    res.status(200).json({
      message: "Trip deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
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