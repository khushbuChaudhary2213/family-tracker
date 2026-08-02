const User = require("../models/userModel");
const Family = require("../models/familyModel");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/sendEmail");
const { preventLastAdminLeaving } = require("../middleware/familyMiddleware");
const { passwordResetTemplate } = require("../utils/emailTemplate");

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

exports.changePasswordUsingCurrentPass = async (req, res, next) => {
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const phoneNumber = req.body?.phoneNumber;
    const user = req.user
      ? await User.findById(req.user._id).select(
          "+resetPasswordOtp +resetPasswordOtpExpiry",
        )
      : await User.findOne({ phoneNumber }).select(
          "+resetPasswordOtp +resetPasswordOtpExpiry",
        );

    if (!user) return next(new ErrorHandler(404, "User not found"));

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    const message = `Your password reset code is: ${otp}. It is valid for 10 minutes. Please do not share this with anyone.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Sentry - Password Reset Code",
        message,
        html: passwordResetTemplate(otp),
      });

      const [name, domain] = user.email.split("@");
      const maskedEmail =
        name.length > 3
          ? `${name[0]}${"*".repeat(name.length - 3)}${name.slice(-2)}@${domain}`
          : `${name[0]}*@${domain}`;

      res.status(200).json({
        success: true,
        message: `OTP sent successfully to registered email!`,
        maskedEmail,
      });
    } catch (err) {
      console.log("Email Error:", err);
      user.resetPasswordOtp = undefined;
      user.resetPasswordOtpExpiry = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new ErrorHandler(500, "Error sending email. Try again later."),
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const phoneNumber = req.body?.phoneNumber;
    const otp = req.body.otp;

    const user = req.user
      ? await User.findById(req.user._id).select(
          "+resetPasswordOtp +resetPasswordOtpExpiry",
        )
      : await User.findOne({ phoneNumber }).select(
          "+resetPasswordOtp +resetPasswordOtpExpiry",
        );

    if (!user) return next(new ErrorHandler(404, "User not found."));

    if (user.resetPasswordOtp !== otp) {
      return next(new ErrorHandler(400, "Invalid OTP code."));
    }

    if (user.resetPasswordOtpExpiry < Date.now()) {
      return next(new ErrorHandler(400, "OTP has expired."));
    }

    res.status(200).json({
      success: true,
      message: "OTP verified. Proceed to reset password.",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const phoneNumber = req.body?.phoneNumber;
    const { otp, newPassword, confirmNewPassword } = req.body;

    if (newPassword !== confirmNewPassword) {
      return next(new ErrorHandler(400, "Passwords do not match."));
    }

    const user = req.user
      ? await User.findById(req.user._id).select(
          "+resetPasswordOtp +resetPasswordOtpExpiry",
        )
      : await User.findOne({ phoneNumber }).select(
          "+resetPasswordOtp +resetPasswordOtpExpiry",
        );

    if (!user) {
      return next(new ErrorHandler(404, "User not found."));
    }

    if (user.resetPasswordOtp !== otp) {
      return next(new ErrorHandler(400, "Invalid OTP code."));
    }

    if (user.resetPasswordOtpExpiry < Date.now()) {
      return next(
        new ErrorHandler(400, "OTP has expired. Please request a new one."),
      );
    }

    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;

    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful! You can now log in.",
    });
  } catch (err) {
    next(err);
  }
};
