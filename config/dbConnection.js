const mongoose = require("mongoose");
require("dotenv").config();

module.exports = mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Database is Connected Successfully");
  })
  .catch((err) => {
    console.log(err);
  });
