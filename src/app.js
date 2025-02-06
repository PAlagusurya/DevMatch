const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();
const { validateSignUpData } = require("./utils/validate");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

require("dotenv").config();

// Middleware to parse JSON data
app.use(express.json());

//Middlewarse to parse cookies
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password } = req.body;

  try {
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

    await user.save();

    res.send("User created successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    //Check if this user with this emailId in DB
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = user.validatePassword(password);

    if (isValidPassword) {
      const token = user.getJWTToken();

      res.cookie("token", token, { expires: new Date(Date.now() + 3600000) });
      res.send("Logged in successfully");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

connectDB()
  .then(() => {
    console.log("connected to DB successfully");
    app.listen(3000, () => {
      console.log("Listening on the port 3000");
    });
  })
  .catch((err) => console.error("Error connecting to DB", err));
