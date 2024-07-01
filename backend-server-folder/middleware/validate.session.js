// const jwt = require("jsonwebtoken");
// const User = require("../models/users.model");

// const validateSession = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//       throw new Error("Authorization header not found");
//     }

//     const token = authHeader.replace("Bearer ", "");

//     const decoded = await jwt.verify(token, process.env.JWT);

//     const user = await User.findById(decoded.id);

//     if (!user) {
//       throw new Error("User not found!");
//     }
//     req.user = user;

//     return next();
//   } catch (err) {
//     console.error("Error in validateSession middleware:", err.message);
//     res.status(401).json({ message: "Unauthorized" });
//   }
// };

// module.exports = validateSession;
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const validateSession = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header not found" });
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, process.env.JWT);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.userId = user._id;
    req.user = user;

    return next();
  } catch (err) {
    console.error("Error in validateSession middleware:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = validateSession;

