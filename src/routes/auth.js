const express = require("express");
const { validateSignUpData } = require("../utils/validate");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password } = req.body;
    // Validation
    validateSignUpData(req);

    //encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    const token = savedUser.getJWTToken();

    res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });

    res.json({ message: "User created successfully", data: savedUser });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //Check if this user with this emailId in DB
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await user.validatePassword(password);

    if (isValidPassword) {
      const token = user.getJWTToken();

      // ✅ Set cookie properly for cross-origin requests
      res.cookie("token", token, {
        httpOnly: true, // Prevents client-side access
        secure: true, // Required for HTTPS
        sameSite: "None", // Allows cross-origin cookies
        path: "/", // Makes cookie available for all routes
        expires: new Date(Date.now() + 3600000), // 1 hour expiration
      });
      res.json({ data: user, message: "LoggedIn Successfully" });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

authRouter.post("/logout", (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logged out successfully!");
});

module.exports = authRouter;
