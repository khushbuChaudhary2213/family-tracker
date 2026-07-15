const express = require("express");
const familyController = require("../controllers/familyController");
const authMiddleware = require("../middleware/authMiddleware");
const familyMiddleware = require("../middleware/familyMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/createFamily", familyController.createFamily);
router.post("/joinFamily/:inviteCode", familyController.joinFamily);

router.get("/me", familyController.getFamilyInfo);

router.post(
  "/:familyId/removeMember",
  familyMiddleware.loadFamily,
  familyMiddleware.isFamilyMember, // checks if target id is in the family or not
  familyMiddleware.isFamilyAdmin, // check if requester is admin or not
  familyMiddleware.preventLastAdminLeaving,
  familyController.removeMember,
);

router.post(
  "/:familyId/leaveFamily",
  familyMiddleware.loadFamily,
  familyMiddleware.isSelfAction, // checks if the memberId is of self or not
  familyMiddleware.isFamilyMember, // Checks if Target id is in the family or not
  familyMiddleware.preventLastAdminLeaving,
  familyController.leaveFamily,
);

router.patch(
  "/:familyId/permissions",
  familyMiddleware.loadFamily, // Fetches the family
  familyMiddleware.isFamilyAdmin, // Checks the requester (are u an admin ?)
  familyMiddleware.isFamilyMember, // Checks the TARGET (Is the person u are changing is actually in the family?)
  familyController.updateMemberPermissions,
);

module.exports = router;
