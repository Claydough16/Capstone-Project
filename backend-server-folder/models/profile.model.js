const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: false,
    },
    userName: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
    country: {
        type: String,
        required: false,
    },
    travelPreferences: {
        type: String,
        required: false,
    },
    interests: {
        type: String,
        required: false,
    }
});

module.exports = mongoose.model("Profile", ProfileSchema);