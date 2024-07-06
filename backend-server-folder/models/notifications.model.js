const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("Notification", NotificationSchema);
