const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendRequest,
  getReceivedRequests,
  getSentRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestController");

router.post("/send", protect, sendRequest);

router.get("/received", protect, getReceivedRequests);

router.get("/sent", protect, getSentRequests);

router.put("/:id/accept", protect, acceptRequest);

router.put("/:id/reject", protect, rejectRequest);

module.exports = router;