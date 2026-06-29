const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Capture synchronous code crashes safely
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

const http = require("http");
const { mongoose } = require("mongoose");
const app = require("./app.js");
const { initSockets } = require("./socket.js");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    // console.log(conn.connections);
    console.log("DB connection successful!");
  })
  .catch((err) => console.error("Mongo error:", err));

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initSockets(server);

server.listen(port, () => {
  console.log(`App is running on port: ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down gracefully...");
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});
