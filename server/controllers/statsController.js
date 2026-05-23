const User = require("../models/User");
const Trip = require("../models/Trip");
const BuddyRequest = require("../models/BuddyRequest");

const getStats = async (req, res) => {
  try {
    const [
      usersCount,
      tripsCount,
      requestsCount,
      destinations,
    ] = await Promise.all([
      User.countDocuments(),
      Trip.countDocuments(),
      BuddyRequest.countDocuments(),
      Trip.distinct("destination"),
    ]);

    const cleanDestinations =
      destinations.filter(
        (dest) =>
          dest &&
          typeof dest === "string" &&
          dest.trim()
      );

    res.status(200).json({
      usersCount,
      tripsCount,
      requestsCount,
      destinationsCount:
        cleanDestinations.length,
    });
  } catch (error) {
    console.log(
      "STATS ERROR:",
      error.message
    );

    res.status(500).json({
      message: "Error fetching stats",
      error: error.message,
    });
  }
};

module.exports = {
  getStats,
};