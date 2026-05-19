const User = require("../models/User");
const Trip = require("../models/Trip");
const BuddyRequest = require("../models/BuddyRequest");

const getStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const tripsCount = await Trip.countDocuments();
    const requestsCount = await BuddyRequest.countDocuments();

    const destinations = await Trip.distinct("destination");
    const destinationsCount = destinations.length;

    res.status(200).json({
      usersCount,
      tripsCount,
      requestsCount,
      destinationsCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

module.exports = { getStats };