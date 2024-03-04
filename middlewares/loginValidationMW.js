const loginValidator = require("../utils/loginValidation");

module.exports = (req, res, next) => {
  let valid = loginValidator(req.body);
  if (valid) {
    next();
  } else {
    res.status(403).json("Error");
  }
};
