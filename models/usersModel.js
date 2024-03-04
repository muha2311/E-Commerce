const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    cart: {
      type: Array,
      default: [],
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address", // another collection named address
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.method("genAuthToken", function () {
  let token = jwt.sign({ email: this.email }, process.env.JWT_SECRET, {
    expiresIn: 1 * 24 * 60 * 60,
  });
  return token;
});

userSchema.method("genRefreshToken", function () {
  let token = jwt.sign({ email: this.email }, process.env.JWT_SCRET_REF_TOKEN, {
    expiresIn: 3 * 24 * 60 * 60,
  });
  return token;
});

module.exports = mongoose.model("users", userSchema);
