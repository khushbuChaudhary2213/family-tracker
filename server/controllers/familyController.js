const Family = require("../models/familyModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const inviteCodeGen = require("../utils/inviteCodeGen");

exports.createFamily = async (req, res, next) => {
  try {
    const { familyName, userId } = req.body;

    if (!familyName || !userId) {
      return next(
        new ErrorHandler(400, `Please provide familyName and userId`),
      );
    }

    const existingFamily = await Family.findOne({ familyName });
    if (existingFamily) {
      return next(new ErrorHandler(400, "Family already exists!"));
    }

    const existingUser = await User.findOne({ phoneNumber: userId });
    if (!existingUser) {
      return next(new ErrorHandler(400, "User doesn't exist!"));
    }

    const family = await Family.create({
      familyName,
      inviteCode: inviteCodeGen(),
      admin: existingUser._id,
      members: [
        { user: existingUser._id, role: "admin", canViewLocationsOf: [] },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Family created successfully!",
      data: {
        family,
      },
    });
  } catch (err) {
    next(err);
  }
};
