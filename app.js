// Environment config
require("dotenv").config();
const { PORT, MONGODB_URI } = process.env;

// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const resourcesDir = "resources";

// App setup
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, resourcesDir)));

// Database connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
    console.error(err);
    console.log("MongoDB connection error. Please make sure MongoDB is running.");
    process.exit();
});

// Routes
app.get("/", (req, res) => {
    res.render("index");
});

var fs = require('fs');
var usersFilePath = path.join(__dirname, 'favicon.ico');
app.get('/favicon.ico', function (req, res) {
    res.send(usersFilePath);
});

app.listen(PORT, () => {
    console.log("App listening at http://localhost:${PORT}");
});
