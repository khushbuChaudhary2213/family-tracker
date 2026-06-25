const express = require("express");
const familyController = require("../controllers/familyController");
const authMiddleware = require("../middleware/authMiddleware");
const familyMiddleware = require("../middleware/familyMiddleware");

const router = express.Router();

router.post(
  "/createFamily",
  authMiddleware.fakeAuth,
  familyController.createFamily,
);
router.post(
  "/joinFamily",
  authMiddleware.fakeAuth,
  familyController.joinFamily,
);

router.get("/", authMiddleware.fakeAuth, familyController.getFamilyInfo);

router.post(
  "/removeMember",
  authMiddleware.fakeAuth,
  familyMiddleware.loadFamily,
  familyMiddleware.isFamilyMember,
  familyMiddleware.isFamilyAdmin,
  familyMiddleware.preventLastAdminLeaving,
  familyController.removeMember,
);

router.post(
  "/leaveFamily",
  authMiddleware.fakeAuth,
  familyMiddleware.loadFamily,
  familyMiddleware.isSelfAction,
  familyMiddleware.isFamilyMember,
  familyMiddleware.preventLastAdminLeaving,
  familyController.leaveFamily,
);

module.exports = router;
