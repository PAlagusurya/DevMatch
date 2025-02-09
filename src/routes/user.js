const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const ALLOWED_USER_FIELDS = [
  "firstName",
  "lastName",
  "gender",
  "skills",
  "about",
  "age",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ALLOWED_USER_FIELDS);

    res.json({ message: "Data fetched successfully", data });
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", ALLOWED_USER_FIELDS)
      .populate("toUserId", ALLOWED_USER_FIELDS);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedInUser._id)) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({
      message: "Fetched connections successfully",
      data,
    });
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const hideUsersFromFeed = new Set();

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).populate("fromUserId", "firstName lastName");

    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId._id.toString());
      hideUsersFromFeed.add(req.toUserId._id.toString());
    });

    const user = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select(ALLOWED_USER_FIELDS);

    res.send(user);
  } catch (e) {
    res.send("ERROR: " + e.message);
  }
});

module.exports = userRouter;
