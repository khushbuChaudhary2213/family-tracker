const { mongoose } = require("mongoose");
const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

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

const server = app.listen(port, () => {
  console.log(`App is running on port: ${port}...`);
});
