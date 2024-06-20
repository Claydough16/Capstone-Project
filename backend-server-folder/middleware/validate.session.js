const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const validateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new Error("Authorization header not found");
    }

    const token = authHeader.replace("Bearer ", "");
    console.log("Token:", token);

    const decoded = await jwt.verify(token, process.env.JWT);

    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error("User not found!");
    }
    req.user = user;

    return next();
  } catch (err) {
    console.error("Error in validateSession middleware:", err.message);
    res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = validateSession;
