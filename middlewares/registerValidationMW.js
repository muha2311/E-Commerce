const registerValidator = require("../utils/registerValidation");

module.exports = (req, res, next) => {
  let valid = registerValidator(req.body);
  if (valid) {
    next();
  } else {
    res.status(403).json({ error: registerValidator.errors[0].message });
  }
};
