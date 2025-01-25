const express = require("express");
const connectDB = require("./config/database");
const app = express();

require("dotenv").config();

connectDB()
  .then(() => {
    console.log("connected to DB successfully");
    app.listen(3000, () => {
      console.log("Listening on the port 3000");
    });
  })
  .catch((err) => console.log(err));
