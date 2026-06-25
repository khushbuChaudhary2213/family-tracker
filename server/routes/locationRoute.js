const express = require("express");
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Guarding the route with your fakeAuth middleware
router.post(
  "/update",
  authMiddleware.fakeAuth,
  locationController.updateLocation,
);

module.exports = router;
