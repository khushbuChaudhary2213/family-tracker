const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
// router.post("/login", authController.logout);

router.use(authMiddleware.protect);

router
  .route("/me")
  .get(userController.getUser)
  .patch(userController.updateProfile);

router.patch("/change-password", userController.changePassword);

module.exports = router;
