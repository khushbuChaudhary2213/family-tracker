const JsonWebTokenError = require("jsonwebtoken");
const User = require("../models/userModel");

exports.fakeAuth = async (req, res, next) => {
  // req.user = await User.findOne({ phoneNumber: "1212121212" });
  // req.user = await User.findOne({ phoneNumber: "4345464684" });
  req.user = await User.findOne({ phoneNumber: "1111111111" });
  console.log(`Logged in user: ${req.user}`);
  next();
};

// fakeAuth();
// module.exports = fakeAuth;
