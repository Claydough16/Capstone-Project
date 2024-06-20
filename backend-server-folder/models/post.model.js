const mongoose = require("mongoose");

// Likes Model
const LikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    username: {
        type: String,
        required: true
    }
});

// Posts Model
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
    likes: [LikeSchema], // Array of likes
    likesCount: {
        type: Number,
        default: 0,
    },


module.exports = mongoose.model("Post", PostSchema);
