const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const usersController = require("../controllers/usersController");
const registerValidator = require("../middlewares/registerValidationMW");
const loginValidator = require("../middlewares/loginValidationMW");
const authorizationMW = require("../middlewares/authorizationMW");
router.use(bodyParser.json());

// create user
router.post("/register", registerValidator, usersController.createUser);

// login user
router.post("/login", loginValidator, usersController.login);

// get all users
router.get(
  "/",
  authorizationMW.tokenMW,
  authorizationMW.isAdmin,
  usersController.getUsers
);

// get user by id
router.get(
  "/:id",
  authorizationMW.tokenMW,
  authorizationMW.isAdmin,
  usersController.getUserById
);

// delete user
router.delete(
  "/:id",
  authorizationMW.tokenMW,
  authorizationMW.isAdmin,
  usersController.deleteUser
);

// update user
router.put("/:id", authorizationMW.tokenMW, usersController.updateUser);

// block user
router.put(
  "/block/:id",
  authorizationMW.tokenMW,
  authorizationMW.isAdmin,
  usersController.blockUser
);

// unblock user
router.put(
  "/unblock/:id",
  authorizationMW.tokenMW,
  authorizationMW.isAdmin,
  usersController.unBlockUser
);

router.post("/refresh", usersController.handleRefreshToken);

router.post("/logout", usersController.logout);

module.exports = router;
