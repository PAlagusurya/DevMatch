const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 30,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(`Enter a Strong Password: ${value}`);
        }
      },
    },
    age: {
      type: Number,
      min: 18,
    },
    photoURL: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error(`Invalid Photo URL: ${value}`);
        }
      },
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "others"],
        message: "{VALUE} is not supported",
      },
    },
    skills: {
      type: [String],
    },
    about: {
      type: String,
      default: "This is a default about of the user!",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWTToken = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEVSURYATINDER@12#", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.validatePassword = function (passwordInputByUser) {
  const user = this;
  const hasedPassword = user.password;

  const isValidPassword = bcrypt.compare(passwordInputByUser, hasedPassword);
  return isValidPassword;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
