const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");

exports.register = async (req, res, next) => {
  try {
    const { phoneNumber, password, confirmPassword } = req.body;

    if (password != confirmPassword)
      return next(
        new ErrorHandler(400, "password and confirmPassword should be same!"),
      );

    const existingUser = await User.findOne({ phoneNumber });

    if (existingUser) {
      return next(new ErrorHandler(400, "User already exists!"));
    }

    const newUser = await User.create({
      phoneNumber,
      password,
      confirmPassword,
    });
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { phoneNumber, password } = req.body;

    const user = await User.findOne({ phoneNumber }).select("+password");
    if (!user) {
      return next(new ErrorHandler(404, "User not found!"));
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler(401, "Invalid Credentials!"));
    }

    res.status(200).json({
      success: true,
      message: "User Login Successfully!",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
