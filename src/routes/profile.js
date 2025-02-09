const express = require("express");
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validateUpdatedPassword,
} = require("../utils/validate");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.json({ data: user });
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  if (!validateEditProfileData(req)) {
    throw new Error("Make sure you are updating the allowed fields only!");
  }

  const loggedInUser = req.user;

  Object.keys(req.body).forEach(
    (field) => (loggedInUser[field] = req.body[field])
  );

  await loggedInUser.save();

  res.json({
    message:
      loggedInUser.firstName + " your profile has been updated successfully!",
  });
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const loggedInUser = req.user;

    const isValidPassword = await loggedInUser.validatePassword(oldPassword);

    if (!isValidPassword) {
      throw new Error("Old password is incorrect!");
    }

    validateUpdatedPassword(newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    loggedInUser.password = hashedPassword;

    await loggedInUser.save();

    res.json({ message: "Password has been updated successfully!" });
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

module.exports = profileRouter;
