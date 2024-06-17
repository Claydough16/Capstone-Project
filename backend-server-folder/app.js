//Dependencies
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;
const MONGO = process.env.MONGODataBase;

//Controllers
const userController = require("./controllers/user.controller");
const messageController = require("./controllers/message.controller");
const roomController = require("./controllers/room.controller");
const postController = require("./controllers/post.controller");

//Database connect
mongoose.connect(`${MONGO}/CapstoneProjectDB`);
const db = mongoose.connection;
db.once("open", () => {
  console.log(`Connected: ${MONGO}`);
});

//Middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/user", userController);
app.use("/room", roomController);
app.use("/message", messageController);
app.use("/post", postController);



app.listen(PORT, () => {
  console.log(`Server is on PORT: ${PORT}`);
});
