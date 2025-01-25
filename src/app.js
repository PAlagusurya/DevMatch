const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

require("dotenv").config();

// Middleware to parse JSON data
app.use(express.json());

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.post("/signup", async (req, res) => {
  const data = req.body;
  try {
    await new User(data).save();
    res.send("User created successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/signup/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOneAndUpdate({ emailId: id });
    console.log(user);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Incrementing age, which is a non-idempotent operation
    user.age += 1;
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

app.put("/signup/:id", async (req, res) => {
  const data = req.body;
  const { id } = req.params;

  try {
    await User.findOneAndUpdate({ _id: id }, data);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong");
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
