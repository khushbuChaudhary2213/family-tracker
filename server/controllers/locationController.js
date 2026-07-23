const User = require("../models/userModel");
const Family = require("../models/familyModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.updateLocation = async (req, res, next) => {
  try {
    const { lng, lat } = req.body;
    const user = req.user;

    if (!lat || !lng)
      return next(
        new ErrorHandler(400, "Latitude or Longitude doesn't exist!"),
      );
    if (-90 > lat || lat > 90 || -180 > lng || lng > 180)
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

exports.getFamilyLocations = async (req, res, next) => {
  try {
    const { familyId } = req.params;
    const family = await Family.findById(familyId).populate(
      "members.user",
      "_id phoneNumber currentLocation locationUpdatedAt isOnline",
    );

    if (!family) return next(new ErrorHandler(404, "Family not found!"));

    const currentUser = family.members.find(
      (m) => m.user._id.toString() === req.user._id.toString(),
    );

    if (!currentUser) {
      return next(
        new ErrorHandler(403, "You are not a member of this family!"),
      );
    }

    const allowedIds = (currentUser?.canViewLocationsOf || []).map((id) =>
      id.toString(),
    );

    const formattedLocations = family.members
      .filter((m) => m.user)
      .map((m) => {
        const memberId = m.user._id.toString();
        const isSelf = currentUser.user._id.toString() === memberId;
        const isAllowed = allowedIds.includes(memberId);
        const canSee = isSelf || isAllowed;

        return {
          _id: m.user._id,
          phoneNumber: m.user.phoneNumber,
          role: m.role,
          isOnline: canSee ? m.user.isOnline : null,
          currentLocation: canSee ? m.user.currentLocation : null,
          locationUpdatedAt: canSee ? m.user.locationUpdatedAt : null,
        };
      });

    res.status(200).json({
      success: true,
      message: "Locations Fetched Successfully!",
      data: {
        familyId: family._id,
        familyName: family.familyName,
        locations: formattedLocations,
      },
    });
  } catch (err) {
    next(err);
  }
};
