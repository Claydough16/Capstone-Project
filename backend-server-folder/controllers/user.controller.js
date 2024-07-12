const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const User = require("../models/users.model");
const Posts = require("../models/post.model");
const profileModel = require("../models/profile.model");
const validateSession = require("../middleware/validate.session");
const sendPasswordResetMail = require("../email");

// ENDPOINT: Create new user
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ userName }, { email }] });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
        userNameExists: existingUser.userName === userName,
        emailExists: existingUser.email === email,
      });
    }

    const user = new User({
      firstName,
      lastName,
      userName,
      email,
      password: bcrypt.hashSync(password, 13),
      passwordReset: "",
      friends: [],
    });

    const newUser = await user.save();

    const createProfile = new profileModel({
      userId: newUser._id,
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      age: "",
      bio: "",
      country: "",
      travelPreferences: "",
      interests: "",
    });
    const newProfile = await createProfile.save();

    const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1 day" });

    res.status(200).json({
      message: "Success!",
      token,
      userId: newUser._id, // Included userId
      userNametag: user.userName,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

// New Login Route:
router.post("/login", async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      throw new Error("Identifier and Password are required");
    }

    const isEmail = identifier.includes("@");
    const user = await User.findOne(
      isEmail ? { email: identifier } : { userName: identifier }
    );

    if (!user) throw new Error("Email/Username or Password does not exist");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      throw new Error("Email/Username or Password does not exist");

    const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1 day" });

    res.status(200).json({
      message: "Successful!",
      token,
      userId: user._id, // Included userId
      userNametag: user.userName,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, SECRET);

    const foundProfile = await profileModel.findOne({ userId: decoded.id });

    res.status(200).json(foundProfile);
  } catch (err) {
    res.status(400).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Profile changes
router.post("/profile", async (req, res) => {
  try {
    console.log("headers", req.headers);
    console.log("body", req.body);
    const token = req.headers["authorization"];
    console.log(token);
    const decoded = jwt.verify(token, SECRET);

    const info = req.body;
    console.log(info);

    const profileUpdate = await profileModel.findOneAndUpdate(
      { userId: decoded.id },
      info,
      {
        new: true,
      }
    );
    console.log(profileUpdate);
    res.status(200).json({});
  } catch (err) {
    res.status(400).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Change Password
router.patch("/change-password", (req, res) => {
  // Add your logic here
});

// ENDPOINT: Get posts liked by a user
router.get("/:userId/Interested", validateSession, async (req, res) => {
  try {
    const { userId } = req.params;

    // Find posts that include the user in the likes array
    const likedPosts = await Posts.find({ "likes.user": userId });

    res.status(200).json(likedPosts);
  } catch (err) {
    console.error("Error fetching liked posts:", err);
    res.status500().json({ ERROR: err.message });
  }
});

// ENDPOINT: Send password reset email
router.get("/password-reset", async (req, res) => {
  try {
    const email = req.query.email;
    // Find user by email
    const foundUser = await User.findOne({ email: email });

    if (!foundUser) {
      res.status(404).json("could not find user");
      return;
    }

    const sentEmail = await sendPasswordResetMail(email);

    res
      .status(200)
      .json({ message: `Password reset email sent`, previewURL: sentEmail });
  } catch (err) {
    console.error("Error", err);
    res.status(500).json({ error: err.message });
  }
});

// ENDPOINT: Reset password
router.post("/password-reset", async (req, res) => {
  console.log("PASSWORD RESET TIME");
  try {
    const { email, token, newPassword } = req.body;

    // Find user by email, check token is correct
    const foundUser = await User.findOne({ email: email });
    console.log("DID WE FIND THE USER");

    if (!foundUser) {
      res.status(401).json("User not found or bad user");
      return;
    }
    console.log("YES???");
    console.log(
      "Found token in database:",
      foundUser.passwordReset,
      "Token provided:",
      token
    );

    if (foundUser.passwordReset !== token) {
      res.status(401).json("Invalid token");
      return;
    }
    console.log("YES!!!");

    const hashedPassword = bcrypt.hashSync(newPassword, 13);
    foundUser.password = hashedPassword;
    foundUser.passwordReset = null;
    await foundUser.save();

    console.log("changedPasswordUser", foundUser);
    res.status(200).json("Password has changed");
    return;
  } catch (err) {
    console.log("Error resetting password" + err);
    res.status(500).json("Error resetting password");
  }
});

// ENDPOINT: Get friends
router.get("/:userId/friends", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate("friends");
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user.friends);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// ENDPOINT: Add friend
router.post("/friends", async (req, res) => {
  try {
    const { userId, friendUserName } = req.body;

    console.log(friendUserName);
    console.log(userId);

    const user = await User.findById(userId);
    const friend = await profileModel.findOne({ userName: friendUserName });

    if (!user || !friend) {
      return res.status(404).send("User or friend not found");
    }

    const friendId = friend.userId;

    if (!user.friends.includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error adding friend:", error);
    res.status(500).send("Error adding friend");
  }
});

// ENDPOINT: Delete friend
router.delete("/friends", async (req, res) => {
  const { userId, friendId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    user.friends.pull(friendId);
    await user.save();
    res.send(user);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
