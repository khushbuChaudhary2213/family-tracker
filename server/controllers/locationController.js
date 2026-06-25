const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.updateLocation = async (req, res, next) => {
  try {
    const { lng, lat } = req.body;
    const user = req.user;

    if (!lat || !lng)
      return next(
        new ErrorHandler(400, "Latitude or Longitude doesn't exist!"),
      );
    if (-90 <= lat >= 90 || -180 <= lng >= 180)
      return next(new ErrorHandler(400, "Latitude or Longitude is not valid"));

    const newLocation = {
      type: "Point",
      coordinates: [Number(lng), Number(lat)],
    };

    const updatedUser = await User.findByIdAndUpdate(
      { _id: user._id },
      {
        $set: { currentLocation: newLocation, locationUpdatedAt: new Date() },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser)
      return next(new ErrorHandler(404, "User profile not found."));

    res.status(200).json({
      success: true,
      message: "User Updated Successfully!",
      data: {
        updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};
