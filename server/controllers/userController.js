const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.getUser = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) return next(new ErrorHandler(401, "You are not logged in!"));

    res.status(200).json({
      status: true,
      message: "User fetched Successfully!",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = req.user;
    const { name } = req.body;

    if (!name) return next(new ErrorHandler(400, "Please enter the name!"));

    const updatedUser = User.findByIdAndUpdate(
      user._id,
      { name },
      { new: true, runValidatiors: true },
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
