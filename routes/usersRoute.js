const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const {
  createUser,
  login,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
} = require("../controllers/usersController");
const registerValidator = require("../middlewares/registerValidationMW");
const loginValidator = require("../middlewares/loginValidationMW");
const { tokenMW, isAdmin } = require("../middlewares/authorizationMW");
router.use(bodyParser.json());

// create user
router.post("/register", registerValidator, createUser);

// login user
router.post("/login", loginValidator, login);

// get all users
router.get("/", tokenMW, isAdmin, getUsers);

// get user by id
router.get("/:id", tokenMW, isAdmin, getUserById);

// delete user
router.delete("/:id", tokenMW, isAdmin, deleteUser);

// update user
router.put("/:id", tokenMW, updateUser);

// block user
router.put("/block/:id", tokenMW, isAdmin, blockUser);

// unblock user
router.put("/unblock/:id", tokenMW, isAdmin, unBlockUser);

router.post("/refresh", handleRefreshToken);

router.post("/logout", logout);

module.exports = router;
