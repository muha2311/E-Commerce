const express = require("express");
const app = express();
const dbConnection = require("./config/dbConnection");
require("dotenv").config();
const usersRouter = require("./routes/usersRoute");
const cookieParser = require("cookie-parser");
const port = process.env.port || 8080;

dbConnection;

app.use(cookieParser());

app.use("/api/users", usersRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
