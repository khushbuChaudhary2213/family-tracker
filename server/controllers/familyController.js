const Family = require("../models/familyModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const inviteCodeGen = require("../utils/inviteCodeGen");
const {
  removeMemberFromFamily,
  removeLocationPermission,
  roleMembers,
} = require("../utils/familyServices");
const { preventLastAdminLeaving } = require("../middleware/familyMiddleware");

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

    const family = await Family.create({
      familyName,
      inviteCode: inviteCodeGen(),
      // multiple admins can be possible that's why omitted
      // admin: existingUser._id,
      members: [{ user: userId, role: "admin", canViewLocationsOf: [] }],
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
      role: "member",
      canViewLocationsOf: [],
    });

    // Find the admin member
    const adminMembers = family.members.filter(
      (member) => member.role == "admin",
    );

    // Give admin access to this user's location
    // console.log(adminMember);
    adminMembers.forEach((admin) => {
      if (!admin.canViewLocationsOf.includes(user._id)) {
        admin.canViewLocationsOf.push(user._id);
      }
    });

    family.markModified("members");

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
    const user = req.user;

    const family = await Family.findOne({
      "members.user": user._id,
    }).populate("members.user", "phoneNumber");

    if (!family) return next(new ErrorHandler(404, "Family not found!"));

    const formattedMembers = family.members
      .filter((m) => m.user) // Safety check in case a user was deleted from the DB
      .map((m) => ({
        _id: m.user._id,
        phoneNumber: m.user.phoneNumber,
      }));

    const admins = roleMembers(family, "admin");
    const formattedAdmins = admins.map((admin) => ({
      _id: admin.user._id.toString(),
      phoneNumber: admin.user.phoneNumber,
    }));

    res.status(200).json({
      success: true,
      message: "Family fetched successfully",
      data: {
        familyName: family.familyName,
        inviteCode: family.inviteCode,
        admins: formattedAdmins,
        members: formattedMembers,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.removeMember = async (req, res, next) => {
  try {
    const { memberId } = req.body;

    // Find Family
    // const family = await Family.findById(familyId);
    // if (!family) return next(new ErrorHandler(404, "Family not found!"));
    const family = req.family;

    /////////////////
    // Handled by MIDDLEWARE

    // Check if member exists
    // const isMember = family.members.some(
    //   (member) => member.user._id.toString() === memberId,
    // );
    // if (!isMember) return next(new ErrorHandler(404, "Member not found!"));

    // // Find target member
    // const targetMember = family.members.find(
    //   (m) => m.user._id.toString() === memberId,
    // );
    // const isTargetAdmin = targetMember?.role === "admin";

    // // Count admins
    // const adminCount = family.members.filter((m) => m.role === "admin").length;

    // // Prevent removing last admin
    // if (adminCount === 1 && isTargetAdmin) {
    //   return next(new ErrorHandler(400, "At least one admin must remain"));
    // }
    // Removing Member
    removeMemberFromFamily(family, memberId);

    // Remove permission references
    removeLocationPermission(family, memberId);

    await family.save();

    res
      .status(200)
      .json({ success: true, message: "Member removed successfully" });
  } catch (err) {
    next(err);
  }
};

exports.leaveFamily = async (req, res, next) => {
  try {
    const { memberId } = req.body;

    // const family = await Family.findById(familyId);
    // if (!family) return next(new ErrorHandler(404, "Family not found!"));

    const family = req.family;

    /////////////////
    // Handled by MIDDLEWARE

    // Check if user is member
    // const isMember = family.members.some(
    //   (member) => member.user._id.toString() === memberId,
    // );
    // if (!isMember)
    //   return next(new ErrorHandler(404, "User not in the family!"));

    // Find if user is admin
    // const targetMember = family.members.find(
    //   (m) => m.user._id.toString() === memberId,
    // );

    // const isTargetAdmin = targetMember?.role === "admin";
    // const adminCount = family.members.filter((m) => m.role === "admin").length;

    // // Rule: admin cannot leave if last admin
    // if (isTargetAdmin && adminCount === 1) {
    //   return next(
    //     new ErrorHandler(
    //       400,
    //       "At least one admin must remain. Promote someone first.",
    //     ),
    //   );
    // }

    removeMemberFromFamily(family, memberId);
    removeLocationPermission(family, memberId);

    await family.save();

    res
      .status(200)
      .json({ success: true, message: "Left family successfully" });
  } catch (err) {
    next(err);
  }
};

exports.updateMemberPermissions = async (req, res, next) => {
  try {
    const { targetMemberId, newAllowedIds } = req.body;

    const family = req.family;
    const targetMember = await family.members.find(
      (m) => m.user._id.toString() === targetMemberId,
    );

    targetMember.canViewLocationsOf = newAllowedIds;

    await family.save();

    res.status(200).json({
      success: true,
      message: "Member Permission Updated Successfulyy!",
      data: {
        family,
      },
    });
  } catch (err) {
    next(err);
  }
};
