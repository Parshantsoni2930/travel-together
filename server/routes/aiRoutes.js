const express = require("express");

const router = express.Router();

const {
  getAISuggestions,
} = require("../controllers/aiController");

router.post(
  "/suggest",
  getAISuggestions
);

module.exports = router;