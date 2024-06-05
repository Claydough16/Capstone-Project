const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const validateSession = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = await jwt.verify(token, process.env.JWT);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error("User not found!");
    req.user = user;
    return next();
  } catch (err) {
    console.log("pinged");
    res.json({ message: err.message });
  }
};

module.exports = validateSession;
