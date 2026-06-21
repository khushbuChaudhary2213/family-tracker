const Family = require("../models/familyModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const inviteCodeGen = require("../utils/inviteCodeGen");

exports.createFamily = async (req, res, next) => {
  try {
    const { familyName } = req.body;

    if (!familyName) {
      return next(new ErrorHandler(400, `Please provide familyName`));
    }
    const existingFamily = await Family.findOne({ familyName });
    if (existingFamily) {
      return next(new ErrorHandler(400, "Family already exists!"));
    }

    const userId = req.user._id;
    const existingUser = await User.findOne({ _id: userId });
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

exports.joinFamily = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    const family = await Family.findOne({ inviteCode });
    if (!family) {
      return next(new ErrorHandler(404, "Family not found!"));
    }

    const user = req.user;
    const isMember = family.members.some(
      (member) => member.user.toString() == user._id.toString(),
    );
    if (isMember)
      return next(
        new ErrorHandler(400, "User is already a member of this family!"),
      );

    // Add new Member
    family.members.push({
      user: user._id,
    });

    // Find the admin member
    const adminMember = family.members.find((member) => member.role == "admin");

    // Give admin access to this user's location
    // console.log(adminMember);
    adminMember.canViewLocationsOf.push(user._id);

    const joinedUser = family.members[family.members.length - 1];

    await family.save();

    res.status(200).json({
      success: true,
      message: "User Joined family successfully!",
      data: {
        family,
        joinedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getFamilyInfo = async (req, res, next) => {
  try {
    const { familyName } = req.body;
    const family = await Family.findOne({ familyName })
      .populate("admin", "_id phoneNumber")
      .populate("members.user", "_id phoneNumber");

    if (!family) return next(new ErrorHandler(404, "Family not found!"));

    res.status(200).json({
      success: true,
      message: "Family fetched successfully",
      data: {
        family,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { familyId, memberId } = req.body;

    // Find Family
    const family = await Family.findById(familyId);
    if (!family) return next(new ErrorHandler(404, "Family not found!"));

    // Find Member
    const isMember = family.members.some(
      (member) => member.user.toString() === memberId,
    );
    if (!isMember) return next(new ErrorHandler(404, "Member not found!"));

    // Preventing removing admin
    if (family.admin.toString() === memberId)
      return next(new ErrorHandler(400, "Admin cannot be removed!"));

    // Removing Member
    family.members = family.members.filter(
      (member) => member.user.toString() !== memberId,
    );
    await family.save();

    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" });
  } catch (err) {
    next(err);
  }
};
