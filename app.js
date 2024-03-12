const express = require("express");
const app = express();
const dbConnection = require("./config/dbConnection");
const cookieParser = require("cookie-parser");
// const morgan = require("morgan");
require("dotenv").config();
const usersRouter = require("./routes/usersRoute");
const productsRouter = require("./routes/productsRoute");

const port = process.env.port || 8080;

dbConnection;

// app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
