const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login" });
    }
    const decodedObj = jwt.verify(token, "DEVSURYATINDER@12#");

    const { _id } = decodedObj;

    const user = await User.findById({ _id });
    if (!user) {
      throw new Error("User not found");
    }
    //atttaching user to the request object
    req.user = user;
    next();
  } catch (e) {
    res.status(400).send("ERROR:" + e.message);
  }
};

module.exports = {
  userAuth,
};
