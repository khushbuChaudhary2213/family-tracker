const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

async function verifyToken(token) {
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);

  if (!user) {
    throw new Error(401, "The user belonging to this token no longer exists!");
  }

  return user;
}

module.exports = verifyToken;
