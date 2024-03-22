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
  updatePassword,
  blockUser,
  unBlockUser,
  handleRefreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/usersController");
const registerValidator = require("../middlewares/registerValidationMW");
const loginValidator = require("../middlewares/loginValidationMW");
const {
  tokenMW,
  isAdmin,
  forgotPassToken,
} = require("../middlewares/authorizationMW");
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

// update password
router.put("/password/:id", tokenMW, updatePassword);

// block user
router.put("/block/:id", tokenMW, isAdmin, blockUser);

// unblock user
router.put("/unblock/:id", tokenMW, isAdmin, unBlockUser);

// handle refresh token
router.post("/refresh", handleRefreshToken);

// logout
router.post("/logout", logout);

// forgot password
router.post("/forgot-password", forgotPassword);

// reset password
router.post("/reset-password/:token", forgotPassToken, resetPassword);

module.exports = router;
