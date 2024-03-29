const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");

const tokenMW = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
      req.user = await User.findOne({ email: decodedToken.email }).exec();
      next();
    } catch (err) {
      console.log(err);
      res.status(401).send(err);
    }
  } else {
    res.status(401).send("Unauthurized.. There is no token");
  }
};

const isAdmin = (req, res, next) => {
  let user = req.user;
  if (user.role !== "admin") {
    return res.status(403).send("You are not an admin");
  }
  next();
};

const forgotPassToken = async (req, res, next) => {
  let token = req.params.token;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_FORGOT_PASS_TOKEN);
    req.user = await User.findOne({ email: decodedToken.email }).exec();
    next();
  } catch (err) {
    console.log(err);
    res.status(401).send("Token Expired.. Please Try Again");
  }
};

module.exports = {
  tokenMW,
  isAdmin,
  forgotPassToken,
};
