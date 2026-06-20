const express = require("express");
const { errorMiddleware } = require("./middleware/errorMiddleware");
const userRoutes = require("./routes/userRoutes");
const familyRoutes = require("./routes/familyRoute");

const app = express();

app.use(express.json());

// app.use("/", (req, res) => {
//   res.status(200).json({
//     status: "success",
//     message: "Hello from Server!",
//   });
// });

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/family", familyRoutes);

app.use(errorMiddleware);

module.exports = app;
