require('dotenv').config();

const express = require('express');
const app = express();
const PORT = process.env.PORT;


const mongoose = require('mongoose');
const MONGO = process.env.MONGODataBase;

mongoose.connect(`${MONGO}/CapstoneProjectDB`);

const db = mongoose.connection;
db.once('open', () => { console.log(`Connected: ${MONGO}`)});


app.use(express.json())


app.listen(PORT, () => { console.log(`Server is on PORT: ${PORT}`)});