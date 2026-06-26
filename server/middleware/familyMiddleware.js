const Family = require("../models/familyModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.loadFamily = async (req, res, next) => {
  try {
    const { familyId } = req.params;

    const family = await Family.findById(familyId).populate(
      "members.user",
      "_id phoneNumber",
    );
    // console.log(family);

    if (!family) {
      return next(new ErrorHandler(404, "Family not found!"));
    }

    req.family = family;

    next();
  } catch (err) {
    next(err);
  }
};

exports.isFamilyMember = (req, res, next) => {
  const memberId = req.body.memberId || req.body.targetMemberId;

  const isMember = req.family.members.some(
    (member) => member.user._id.toString() === memberId,
  );

  if (!isMember) {
    return next(new ErrorHandler(404, "User not in the family!"));
  }

  next();
};

exports.isFamilyAdmin = (req, res, next) => {
  const requester = req.family.members.find(
    (m) => m.user._id.toString() === req.user._id.toString(),
  );

  if (!requester || requester.role !== "admin") {
    return next(new ErrorHandler(403, "Admin only action"));
  }

  next();
};

exports.isSelfAction = (req, res, next) => {
  if (req.body.memberId !== req.user._id.toString()) {
    return next(new ErrorHandler(403, "You can only act on yourself"));
  }

  next();
};

exports.preventLastAdminLeaving = (req, res, next) => {
  const { memberId } = req.body;
  const family = req.family;

  const targetMember = family.members.find(
    (m) => m.user._id.toString() === memberId,
  );

  const isTargetAdmin = targetMember?.role === "admin";

  const adminCount = family.members.filter((m) => m.role === "admin").length;

  if (isTargetAdmin && adminCount === 1) {
    return next(
      new ErrorHandler(
        400,
        "At least one admin must remain. Promote someone first.",
      ),
    );
  }

  next();
};
