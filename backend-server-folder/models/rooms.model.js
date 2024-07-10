const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: false, // this doesn't work for some reason
  },
  description: {
    type: String,
  },
  addedUsers: {
    type: Array,
  },
});

module.exports = mongoose.model("room", RoomSchema);
