const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT;
const User = require("../models/users.model");
const profileModel = require("../models/profile.model");

//ENDPOINT: Create new user
router.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, userName, email, password } = req.body;

        const user = new User({
            firstName,
            lastName,
            userName,
            email,
            password: bcrypt.hashSync(password, 13),
        });

        const newUser = await user.save();
        const createProfile = new profileModel({ 
            userId: newUser._id,
            firstName: firstName,
            lastName: lastName,
            age: "",
            bio: "",
            country: "",
            travelPreferences: "",
            interests: ""
        });
        const newProfile = await createProfile.save();
        const token = jwt.sign({ id: newUser._id }, SECRET, { expiresIn: "1 day" });

        res.status(200).json({
            // user: newUser, //has password that user created, don't want that on the web
            message: "Success!",
            token,
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

        const isEmail = identifier.includes('@');
        const user = await User.findOne(isEmail ? { email: identifier } : { userName: identifier });

        if (!user) throw new Error('Email/Username or Password does not exist');

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) throw new Error('Email/Username or Password does not exist');

        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '1 day' });

        res.status(200).json({
            message: "Successful!",
            token,
        });
    } catch (err) {
        res.status(500).json({
            ERROR: err.message
        });
    }
});
//ENDPOINT: Edit user

//ENDPOINT: Get user by tag <--- WIP

//ENDPOINT: Delete user

//ENDPOINT: Profile
router.get("/profile", async (req, res) => {
    try {
        const token = req.headers["authorization"];
        const decoded = jwt.verify(token, SECRET);
    
        const foundProfile = await profileModel.findOne({ userId: decoded.id});
    

        res.status(200).json(foundProfile);
        
    } catch (err) {
        res.status(400).json({
            ERROR: err.message
        });
    }
})

//ENDPOINT: Profile changes
router.post("/profile", async (req, res) => {
    try {
        console.log("headers", req.headers);
        console.log("body", req.body);
        const token = req.headers["authorization"];
        console.log(token)
        const decoded = jwt.verify(token, SECRET);

        // const { firstName, lastName, age, bio, country, travelPreferences, interests} = req.body;
        const info = req.body;
        console.log(info)

        const profileUpdate = await profileModel.findOneAndUpdate({ userId: decoded.id}, info, {
            new: true
        });
        console.log(profileUpdate)
        res.status(200).json({});

    } catch (err) {
        res.status(400).json({
            ERROR: err.message
        });
    }
})

//ENDPOINT: Change Password
router.patch("/change-password", (req, res) => {

})


module.exports = router;
