const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const User = require("../models/users.model");

//ENDPOINT: Create new user
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 13),
    });

    const newUser = await user.save();
    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1 day" });

    res.status(200).json({
      user: newUser,
      message: "Success!",
      token,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) throw new Error(`Email or Password does not exist`);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new Error(`Email or Password does not exist`);
    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1 day" });

    res.status(200).json({
      message: "Succesful!",
      user,
      token,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});
//ENDPOINT: Edit user

//ENDPOINT: Get user by tag <--- WIP

//ENDPOINT: Delete user

module.exports = router;
