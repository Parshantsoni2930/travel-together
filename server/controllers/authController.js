const bcrypt = require("bcryptjs");

const User = require("../models/User");

const generateToken = require("../Utils/generateToken");

// REGISTER USER
const registerUser = async (
  req,
  res
) => {
  try {
    let { name, email, password } =
      req.body;

    // validation
    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "Name, email and password are required",
      });
    }

    name = name.trim();
    email = email
      .trim()
      .toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    // check existing user
    const userExists =
      await User.findOne({
        email,
      });

    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    // hash password
    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    // create user
    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
      });

    res.status(201).json({
      message:
        "User registered successfully",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage:
          user.profileImage ||
          "",
      },

      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    console.log(
      "REGISTER ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// LOGIN USER
const loginUser = async (
  req,
  res
) => {
  try {
    let { email, password } =
      req.body;

    if (!email || !password) {
      return res.status(400).json({
        message:
          "Email and password are required",
      });
    }

    email = email
      .trim()
      .toLowerCase();

    // find user
    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    // compare password
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        message:
          "Invalid email or password",
      });
    }

    res.status(200).json({
      message:
        "Login successful",

      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.age,
        gender: user.gender,
        city: user.city,
        interests:
          user.interests,
        bio: user.bio,
        profileImage:
          user.profileImage ||
          "",
      },

      token: generateToken(
        user._id,
        user.role
      ),
    });
  } catch (error) {
    console.log(
      "LOGIN ERROR:",
      error
    );

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};