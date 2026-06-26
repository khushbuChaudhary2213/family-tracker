const JsonWebTokenError = require("jsonwebtoken");
const User = require("../models/userModel");

exports.fakeAuth = async (req, res, next) => {
  // req.user = await User.findOne({ phoneNumber: "1212121212" });
  // req.user = await User.findOne({ phoneNumber: "5555555555" });
  req.user = await User.findOne({ phoneNumber: "3333333333" });
  console.log(`Logged in user: ${req.user}`);
  next();
};

// fakeAuth();
// module.exports = fakeAuth;
