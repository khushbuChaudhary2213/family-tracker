const errorMiddleware = (err, req, res, next) => {
  console.error("💥 ERROR:", err);
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "ValidationError") {
    err.message = Object.values(err.errors)
      .map((el) => el.message)
      .join(". ");
    err.statusCode = 400;
  }

  if (err.code === 11000) {
    err.message = "This phone number is already registered!";
    err.statusCode = 400;
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = { errorMiddleware };
