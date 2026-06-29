const express = require("express");
const locationController = require("../controllers/locationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware.protect);

router.post("/update", locationController.updateLocation);

router.get("/getFamilyLocations", locationController.getFamilyLocations);

module.exports = router;
