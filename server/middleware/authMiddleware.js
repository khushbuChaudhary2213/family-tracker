const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new ErrorHandler(
          401,
          "You are not logged in. Please log in again to gain access!",
        ),
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new ErrorHandler(
          401,
          "The user belonging to this token no longer exists!",
        ),
      );
    }

    req.user = currentUser;
    console.log(`Logged in user: ${req.user}`);

    next();
  } catch (err) {
    next(err);
  }
};

// fakeAuth();
// module.exports = fakeAuth;
