const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createTrip,
  getAllTrips,
  getMyTrips,
  getTripById,
  updateTrip,
  deleteTrip,
} = require("../controllers/tripController");

router.post("/", protect, createTrip);

router.get("/", getAllTrips);

router.get("/my", protect, getMyTrips);

router.get("/:id", getTripById);

router.put("/:id", protect, updateTrip);

router.delete("/:id", protect, deleteTrip);

module.exports = router;