const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: false,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  location: {
    type: Array,
    required: false,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: false,
  },
  likesCount: {
    type: Number,
    default: 0, // Default value for the number of likes
  },
});

module.exports = mongoose.model("Post", PostSchema);
