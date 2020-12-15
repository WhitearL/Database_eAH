// Environment config
require("dotenv").config();
const { PORT, MONGODB_URI } = process.env;

// Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");

const playerController = require("./controllers/player");

const resourcesDir = "resources";

// App setup
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, resourcesDir)));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log("MongoDB connection error. Please ensure MongoDB is running.");
  process.exit();
});

// Routes
app.get("/", (req, res) => {
  res.render("index");
});
app.get("/browse", (req, res) => {
  res.render("browse");
});
app.get("/manage", (req, res) => {
  res.render("manage");
});
app.get("/analyse", (req, res) => {
  res.render("analyse");
});

app.get("/createplayer", (req, res) => {
  res.render("createplayer");
});
app.post("/createplayer", playerController.createPlayer);

// Serve the page icon.
var usersFilePath = path.join(__dirname, "favicon.ico");
app.get("/favicon.ico", function (req, res) {
  res.send(usersFilePath);
});

// Listening.
app.listen(PORT, () => {
  console.log("App listening at http://localhost:${PORT}");
});
