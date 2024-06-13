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
  location: {
    type: String,
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
  /*  image: {
    type: ImageData,
    required: false,
  }, */
});

module.exports = mongoose.model("Post", PostSchema);
