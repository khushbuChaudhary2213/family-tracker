const express = require("express");
const familyController = require("../controllers/familyController");
const authMiddleware = require("../middleware/authMiddleware");

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

module.exports = router;
