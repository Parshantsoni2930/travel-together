const mongoose = require("mongoose");

const userSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },

      password: {
        type: String,
        required: true,
      },

      age: {
        type: Number,
        default: null,
      },

      gender: {
        type: String,
        default: "",
      },

      city: {
        type: String,
        default: "",
      },

      interests: {
        type: [String],
        default: [],
      },

      bio: {
        type: String,
        default: "",
      },

      profileImage: {
        type: String,
        default: "",
      },

      role: {
        type: String,
        enum: [
          "user",
          "admin",
        ],
        default: "user",
      },

      blockedUsers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      friends: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      friendRequests: [
        {
          sender: {
            type:
              mongoose.Schema.Types
                .ObjectId,
            ref: "User",
          },

          status: {
            type: String,
            enum: [
              "pending",
              "accepted",
              "rejected",
            ],
            default: "pending",
          },
        },
      ],

      sentRequests: [
        {
          type:
            mongoose.Schema.Types
              .ObjectId,
          ref: "User",
        },
      ],
    },
    {
      timestamps: true,
    }
  );

// remove password from JSON response
userSchema.methods.toJSON =
  function () {
    const user =
      this.toObject();

    delete user.password;

    return user;
  };

// indexes
userSchema.index({
  email: 1,
});

module.exports =
  mongoose.model(
    "User",
    userSchema
  );