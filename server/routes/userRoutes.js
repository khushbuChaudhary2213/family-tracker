const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/signup", authController.register);
router.post("/login", authController.login);
// router.post("/login", authController.logout);

router.post("/forgot-password", userController.forgotPassword);
router.post("/verify-otp", userController.verifyOTP);
router.post("/reset-password", userController.resetPassword);

router.use(authMiddleware.protect);

router
  .route("/me")
  .get(userController.getUser)
  .patch(userController.updateProfile)
  .delete(userController.deleteProfile);

router.patch("/change-password", userController.changePasswordUsingCurrentPass);
router.post("/request-password-change-otp", userController.forgotPassword);
router.post("/verify-password-change-otp", userController.verifyOTP);
router.post("/reset-password-with-otp", userController.resetPassword);

module.exports = router;
