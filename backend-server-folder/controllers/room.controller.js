const router = require("express").Router();
const Room = require("../models/rooms.model");
const validateSession = require("../middleware/validate.session");

//ENDPOINT: Create new room
router.post("/", validateSession, async (req, res) => {
  try {
    const { name, description, addedUsers } = req.body;
    const room = new Room({ name, description, addedUsers });

    const newRoom = await room.save();
    res.status(200).json({
      result: newRoom,
      message: `${newRoom.name} added to colllection`,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

//ENDPOINT: Get all rooms. Does checks user is on added list.
router.get("/:userName", async (req, res) => {
  try {
    const { userName } = req.params;

    const getAllRooms = await Room.find({ addedUsers: userName });

    res.status(200).json({
      result: getAllRooms,
    });
  } catch (err) {
    res.status(500).json({
      Error: err.message,
    });
  }
});

//ENDPOINT: Delete room

//ENDPOINT: Edit room

module.exports = router;
