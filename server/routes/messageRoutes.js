const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  sendMessage,
  getMessages,
  deleteMessage,
} = require("../controllers/messageController");

router.post(
  "/send",
  protect,
  sendMessage
);

router.get(
  "/:userId",
  protect,
  getMessages
);

router.delete(
  "/:id",
  protect,
  deleteMessage
);

module.exports = router;