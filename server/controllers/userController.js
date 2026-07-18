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

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { name },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (newPassword != confirmNewPassword)
      return next(
        new ErrorHandler("New Password and Confirm New Password doesn't match"),
      );

    const user = await User.findById(req.user._id).select("+password");

    const isMatch = await user.correctPassword(currentPassword, user.password);

    if (!isMatch)
      return next(
        new ErrorHandler(
          401,
          "Current Password doesn't match the existing Password",
        ),
      );

    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;

    await user.save();

    user.password = undefined;
    user.confirmPassword = undefined;

    res.status(201).json({
      status: true,
      message: "Password Changed Successfully",
      data: {
        updatedUser: user,
      },
    });
  } catch (err) {
    next(err);
  }
};
