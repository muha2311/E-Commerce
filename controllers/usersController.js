const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
const createUser = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(400).send(`${user.email} is already registered`);
    }
    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
    });

    await user.save();

    res.status(200).json({ message: user });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Login
const login = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(400).send("Invalid Email");
    }
    let pass = await bcrypt.compare(req.body.password, user.password);
    if (!pass) {
      return res.status(400).send("Invalid Password");
    }
    const refreshToken = user.genRefreshToken();
    //console.log(refreshToken);
    await User.findByIdAndUpdate(
      user._id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      id: user._id,
      token: user.genAuthToken(),
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: "Login Failed" });
  }
};

// Handle refresh token
const handleRefreshToken = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    res.status(401).send("Access Denied.. No refresh token provided");
  }
  try {
    let user = await User.findOne({ refreshToken });
    const decodedToken = jwt.verify(
      refreshToken,
      process.env.JWT_SCRET_REF_TOKEN
    );
    if (user.email != decodedToken.email) {
      return res.status(400).send("Refresh token not matched");
    }
    const accessToken = user.genAuthToken();
    res.status(200).json({
      email: decodedToken.email,
      accessToken: accessToken,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid Token");
  }
};

// Logout
const logout = async (req, res) => {
  const refreshToken = req.cookies["refreshToken"];
  if (!refreshToken) {
    res.status(401).send("Access Denied.. No refresh token provided");
  }
  try {
    await User.findOneAndUpdate({ refreshToken }, { refreshToken: " " });
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    res.sendStatus(204);
  } catch (err) {
    res.status(400).send("User not logged out");
  }
};

// Get all Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(404).send("Users not found");
  }
};

// Get user by id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(404).send("User not found");
  }
};

// Update a user
const updateUser = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      returnOriginal: false,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User Deleted");
  } catch (err) {
    console.log(err);
  }
};

// block user
const blockUser = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isBlocked: true },
      {
        returnOriginal: false,
      }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User is blocked");
  } catch (err) {
    console.log(err);
  }
};

// unblock user
const unBlockUser = async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { isBlocked: false },
      {
        returnOriginal: false,
      }
    );
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).send("User is unblocked");
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
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
};
