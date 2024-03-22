const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.method("genAuthToken", function () {
  let token = jwt.sign({ email: this.email }, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: 1 * 24 * 60 * 60,
  });
  return token;
});

userSchema.method("genRefreshToken", function () {
  let token = jwt.sign({ email: this.email }, process.env.JWT_REFRESH_TOKEN, {
    expiresIn: 3 * 24 * 60 * 60,
  });
  return token;
});

userSchema.method("createPasswordResetToken", function () {
  this.passwordResetToken = jwt.sign(
    { email: this.email },
    process.env.JWT_FORGOT_PASS_TOKEN,
    {
      expiresIn: "10m",
    }
  );
  this.passwordResetExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return this.passwordResetToken;
});

module.exports = mongoose.model("users", userSchema);
