const router = require("express").Router();
const validateSession = require("../middleware/validate.session");
const Messages = require("../models/messages.model");

//ENDPOINT: Create new message
router.post("/new", async (req, res) => {
  try {
    const { when, user, room, body } = req.body;

    const message = Messages({
      when: new Date(),
      user,
      room,
      body,
    });

    const newMessage = await message.save();
    res.status(200).json({
      result: newMessage,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Read All Messages
router.get("/all", async (req, res) => {
  try {
    const getAllMessages = await Messages.find();
    if (getAllMessages.length > 0) {
      res.status(200).json({
        result: getAllMessages,
      });
    }
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Read All Messages by User
router.get("/:userName", async (req, res) => {
  try {
    const { userName } = req.params;
    console.log(userName);
    const getRoomMessages = await Messages.find({ room: userName });
    res.status(200).json({
      result: getRoomMessages,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Update Message
router.patch("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const info = req.body;

    const patchMessage = await Messages.findOneAndUpdate(
      { _id: id }, // if both of these values match, continue
      info,
      { new: true }
    );
    res.status(200).json({
      message: patchMessage,
    });
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

//ENDPOINT: Delete Message
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const delMessage = await Messages.deleteOne({ _id: id });

    if (delMessage.deletedCount) {
      res.status(200).json({
        message: "removed",
      });
    } else {
      res.send("Message does not exist");
    }
  } catch (err) {
    res.status(500).json({
      ERROR: err.message,
    });
  }
});

module.exports = router;
