const express = require("express");
const familyController = require("../controllers/familyController");

const router = express.Router();

router.post("/createFamily", familyController.createFamily);

module.exports = router;
