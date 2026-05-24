const mongoose = require("mongoose");
const User = require("../models/User");

// GET PROFILE
const getProfile = async (req, res) => {
  try {
    return res.status(200).json({
      message: "User profile fetched",
      user: req.user,
    });
  } catch (error) {
    console.log("GET PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const {
      name,
      age,
      gender,
      city,
      bio,
      interests,
    } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (city !== undefined) user.city = city;
    if (bio !== undefined) user.bio = bio;

    if (interests !== undefined) {
      user.interests = Array.isArray(interests)
        ? interests
        : interests
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean);
    }

    if (req.file) {
      user.profileImage = req.file.path;
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.log("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET PUBLIC PROFILE
const getPublicProfile = async (req, res) => {
  try {
    const profileUserId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(profileUserId)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const currentUserId = req.user._id;
    const user = await User.findById(profileUserId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const currentUser = await User.findById(currentUserId);

    let friendStatus = "none";

    if (currentUser.friends?.some(
      (id) => id.toString() === profileUserId
    )) {
      friendStatus = "friends";
    } else if (currentUser.sentRequests?.some(
      (id) => id.toString() === profileUserId
    )) {
      friendStatus = "sent";
    } else if (currentUser.friendRequests?.some(
      (r) => r.sender?.toString() === profileUserId && r.status === "pending"
    )) {
      friendStatus = "received";
    }

    return res.status(200).json({
      user,
      friendStatus,
    });
  } catch (error) {
    console.log("GET PUBLIC PROFILE ERROR:", error);
    return res.status(500).json({
      message: "Error loading profile",
      error: error.message,
    });
  }
};

// SEND FRIEND REQUEST
const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id.toString();
    const receiverId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(receiverId)) {
      return res.status(400).json({
        message: "Invalid receiver id",
      });
    }

    if (senderId === receiverId) {
      return res.status(400).json({
        message: "Cannot send request to yourself",
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    sender.sentRequests = sender.sentRequests || [];
    receiver.friendRequests = receiver.friendRequests || [];
    receiver.friends = receiver.friends || [];

    const alreadyFriend = receiver.friends.some(
      (id) => id.toString() === senderId
    );

    if (alreadyFriend) {
      return res.status(400).json({
        message: "Already buddies",
      });
    }

    const alreadyRequested = receiver.friendRequests.some(
      (r) => r.sender?.toString() === senderId && r.status === "pending"
    );

    if (alreadyRequested) {
      return res.status(400).json({
        message: "Buddy request already sent",
      });
    }

    receiver.friendRequests.push({
      sender: senderId,
      status: "pending",
    });

    if (!sender.sentRequests.some(id => id.toString() === receiverId)) {
      sender.sentRequests.push(receiverId);
    }

    await sender.save();
    await receiver.save();

    return res.status(200).json({
      message: "Buddy request sent",
    });
  } catch (error) {
    console.log("SEND FRIEND REQUEST ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ACCEPT FRIEND REQUEST
const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const senderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: "Invalid sender id" });
    }

    const user = await User.findById(userId);
    const sender = await User.findById(senderId);

    if (!user || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = user.friendRequests.find(
      (r) => r.sender.toString() === senderId && r.status === "pending"
    );

    if (!request) {
      return res.status(404).json({ message: "Buddy request not found" });
    }

    request.status = "accepted";

    if (!user.friends.some(f => f.toString() === senderId)) user.friends.push(senderId);
    if (!sender.friends.some(f => f.toString() === userId)) sender.friends.push(userId);

    user.sentRequests = user.sentRequests.filter(id => id.toString() !== senderId);
    sender.sentRequests = sender.sentRequests.filter(id => id.toString() !== userId);

    await user.save();
    await sender.save();

    return res.status(200).json({
      message: "Buddy request accepted",
    });
  } catch (error) {
    console.log("ACCEPT FRIEND REQUEST ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// REJECT FRIEND REQUEST
const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const senderId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ message: "Invalid sender id" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friendRequests = user.friendRequests.filter(
      (r) => !(r.sender.toString() === senderId && r.status === "pending")
    );

    await user.save();

    return res.status(200).json({
      message: "Buddy request rejected",
    });
  } catch (error) {
    console.log("REJECT FRIEND REQUEST ERROR:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// GET FRIENDS
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friends", "name email profileImage city");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ friends: user.friends || [] });
  } catch (error) {
    console.log("GET FRIENDS ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET FRIEND REQUESTS
const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("friendRequests.sender", "name email profileImage city");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const requests = user.friendRequests
      .filter(r => r.status === "pending" && r.sender)
      .map(r => ({
        _id: r.sender._id,
        name: r.sender.name,
        email: r.sender.email,
        profileImage: r.sender.profileImage,
        city: r.sender.city,
        status: r.status,
      }));

    return res.status(200).json({ requests });
  } catch (error) {
    console.log("GET FRIEND REQUESTS ERROR:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getPublicProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriends,
  getFriendRequests,
};