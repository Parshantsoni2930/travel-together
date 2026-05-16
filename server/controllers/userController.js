const User = require("../models/User");

const getProfile = async (req, res) => {
  res.json({
    message: "User profile fetched",
    user: req.user,
  });
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, age, gender, city, bio, interests } = req.body;

    user.name = name ?? user.name;
    user.age = age ?? user.age;
    user.gender = gender ?? user.gender;
    user.city = city ?? user.city;
    user.bio = bio ?? user.bio;

    if (interests) {
      user.interests = Array.isArray(interests)
        ? interests
        : interests.split(",").map((item) => item.trim()).filter(Boolean);
    }

    if (req.file) {
      user.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getPublicProfile = async (req, res) => {
  try {
    const profileUserId = req.params.id;
    const currentUserId = req.user.id;

    const user = await User.findById(profileUserId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUser = await User.findById(currentUserId);

    let friendStatus = "none";

    if (currentUser.friends?.some((friendId) => friendId.toString() === profileUserId)) {
      friendStatus = "friends";
    } else if (
      currentUser.sentRequests?.some((requestId) => requestId.toString() === profileUserId)
    ) {
      friendStatus = "sent";
    } else if (
      currentUser.friendRequests?.some((requestId) => requestId.toString() === profileUserId)
    ) {
      friendStatus = "received";
    }

    res.json({
      user,
      friendStatus,
    });
  } catch (error) {
    res.status(500).json({ message: "Error loading profile" });
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const senderId = req.user._id.toString();
    const receiverId = req.params.id;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const receiver = await User.findById(receiverId);

    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    const alreadyFriend = receiver.friends.some(
      (friendId) => friendId.toString() === senderId
    );

    if (alreadyFriend) {
      return res.status(400).json({ message: "Already buddies" });
    }

    const alreadyRequested = receiver.friendRequests.some(
      (request) => request.sender.toString() === senderId && request.status === "pending"
    );

    if (alreadyRequested) {
      return res.status(400).json({ message: "Buddy request already sent" });
    }

    receiver.friendRequests.push({
      sender: senderId,
      status: "pending",
    });

    await receiver.save();

    res.json({ message: "Buddy request sent" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const senderId = req.params.id;

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

    if (!user.friends.some((friendId) => friendId.toString() === senderId)) {
      user.friends.push(senderId);
    }

    if (!sender.friends.some((friendId) => friendId.toString() === userId)) {
      sender.friends.push(userId);
    }

    await user.save();
    await sender.save();

    res.json({ message: "Buddy request accepted" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const senderId = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.friendRequests = user.friendRequests.filter(
      (r) => !(r.sender.toString() === senderId && r.status === "pending")
    );

    await user.save();

    res.json({ message: "Buddy request rejected" });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friends",
      "name email profileImage city"
    );

    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "friendRequests.sender",
      "name email profileImage city"
    );

    const requests = user.friendRequests.filter(
      (request) => request.status === "pending"
    );

    res.json({ requests });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
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