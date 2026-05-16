const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getProfile,
  updateProfile,
  getPublicProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
} = require("../controllers/userController");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profileImage"), updateProfile);

router.get("/friends", protect, getFriends);
router.get("/friend-requests", protect, getFriendRequests);
router.post("/friend-request/:id", protect, sendFriendRequest);
router.post("/friend-accept/:id", protect, acceptFriendRequest);
router.post("/friend-reject/:id", protect, rejectFriendRequest);
router.get("/:id", protect, getPublicProfile);

module.exports = router;