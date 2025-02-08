const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

require("dotenv").config();

// Middleware to parse JSON data
app.use(express.json());

//Middlewarse to parse cookies
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDB()
  .then(() => {
    console.log("connected to DB successfully");
    app.listen(3000, () => {
      console.log("Listening on the port 3000");
    });
  })
  .catch((err) => console.error("Error connecting to DB", err));
