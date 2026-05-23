const mongoose = require("mongoose");

const buddyRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

buddyRequestSchema.index(
  {
    sender: 1,
    receiver: 1,
    trip: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("BuddyRequest", buddyRequestSchema);