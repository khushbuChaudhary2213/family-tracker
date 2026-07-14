const bcrypt = require("bcryptjs");
const User = require("../models/userModel.js");
const ErrorHandler = require("../utils/ErrorHandler.js");
const signToken = require("../utils/signToken.js");

exports.register = async (req, res, next) => {
  try {
    const { name, phoneNumber, password, confirmPassword } = req.body;

    if (password != confirmPassword)
      return next(
        new ErrorHandler(400, "password and confirmPassword should be same!"),
      );

    const existingUser = await User.findOne({ phoneNumber });
    console.log(existingUser);

    if (existingUser) {
      return next(new ErrorHandler(400, "User already exists!"));
    }

    const newUser = await User.create({
      name,
      phoneNumber,
      password,
      confirmPassword,
    });

    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      data: { user: newUser },
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
    const isMatch = await user.correctPassword(password, user.password);

    if (!isMatch) {
      return next(new ErrorHandler(401, "Incorrect phone number or password!"));
    }

    const token = signToken(user._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "User Login Successfully!",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
