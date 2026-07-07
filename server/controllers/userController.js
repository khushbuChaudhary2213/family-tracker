const ErrorHandler = require("../utils/ErrorHandler");

exports.getUser = async (req, res) => {
  try {
    const user = req.user;

    if (!user) return next(new ErrorHandler("You are not logged in!"));

    res.status(200).json({
      status: true,
      message: "User fetched Successfully!",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};
