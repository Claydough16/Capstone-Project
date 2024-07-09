const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  when: {
    type: Date,
    default: Date.now,
    required: true,
  },
  user: {
    type: String,
    required: false,
  },
  room: {
    type: String,
    required: false,
  },
  body: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Message", MessageSchema);
