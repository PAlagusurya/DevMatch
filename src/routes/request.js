const express = require("express");
const { userAuth } = require("../middlewares/auth.js");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest.js");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status!" });
      }

      //Check if user exists
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      //check if connection request is already made
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection request already exists!" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await connectionRequest.save();
      res.send(
        status === "ignored"
          ? `${req.user.firstName} ${status} ${toUser.firstName}`
          : `${req.user.firstName} is ${status} in  ${toUser.firstName}`
      );
    } catch (e) {
      res.status(400).send("ERROR:" + e.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const currentUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Invalid status!" });
      }

      //toUserId: currentUser._id - to check if I have received the request to accept or reject
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        status: "interested",
        toUserId: currentUser._id,
      });

      if (!connectionRequest) {
        return res.status(404).json({ message: "Request not found!" });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: `Request ${status} successfully`, data });
    } catch (e) {
      res.status(400).send("ERROR:" + e.message);
    }
  }
);

module.exports = requestRouter;
