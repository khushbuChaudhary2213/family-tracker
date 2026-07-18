const User = require("../models/userModel");
const Family = require("../models/familyModel");
const ErrorHandler = require("../utils/ErrorHandler");
// const { removeMemberFromFamily } = require("../utils/familyServices");
const { preventLastAdminLeaving } = require("../middleware/familyMiddleware");

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

exports.deleteProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userFamilies = await Family.find({ "members.user": userId });

    for (const fam of userFamilies) {
      let middlewareErr = null;

      const mockReq = {
        body: { memberId: userId.toString() },
        family: fam,
      };

      const mockNext = (err) => {
        if (err) middlewareErr = err;
      };

      preventLastAdminLeaving(mockReq, res, mockNext);

      if (middlewareErr) {
        return next(middlewareErr);
      }
    }

    await Family.updateMany(
      { "members.user": userId },
      {
        $pull: {
          members: { user: userId },
        },
      },
    );

    const deletedUser = await User.findByIdAndDelete(req.user._id);
    if (!deletedUser) {
      return next(new ErrorHandler(404, "User not found"));
    }

    res.status(200).json({
      status: true,
      message: "User Deleted Successfully",
    });
    // removeMemberFromFamily(req.user);
  } catch (err) {
    next(err);
  }
};
