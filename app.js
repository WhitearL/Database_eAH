// Environment config
require("dotenv").config();
const { PORT, MONGODB_URI } = process.env;

// Dependencies and constants
const expressSession = require("express-session");
const Player = require("./models/Player");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");
const fs = require('fs') 
const resourcesDir = "resources";
  
// Auth id
global.player = false;

// App setup
const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, resourcesDir)));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Establish session with long expiry time.
app.use(expressSession({ 
	secret: "AHDBApp", 
	cookie: { expires: new Date(253402300000000) },
	resave: true, // Address recent deprecations to expressSession
	saveUninitialized: true 
}));

// Database connection
mongoose.connect(MONGODB_URI, { 
	// Address recent deprecations
	useNewUrlParser: true, 
	useUnifiedTopology: true, 
	useCreateIndex: true 
});

// Mongo connection error callback
mongoose.connection.on("error", (err) => {
	console.error(err);
	console.log("MongoDB connection error. Please ensure MongoDB is running.");
	process.exit();
});

const playerController = require("./controllers/player");
const auctionController = require("./controllers/auction");

// Inject player session data into all requests.
app.use("*", async (req, res, next) => {
	if (req.session.playerid && !global.player) {
		const player = await Player.find({playerid: req.session.playerid}, {_id:0});
		global.player = eval("(" + player + ")"); // Normalise the JSON
	}
	next();
})

// Routes
app.get("/", (req, res) => {res.render("index");});

// Basic page paths.
app.get("/browse", auctionController.listAuctions);
app.get("/manage/:playerid", auctionController.listPlayerAuctions);
app.get("/manage", (req, res) => {res.render("common/loginwarning");});
app.get("/analyse", (req, res) => {res.render("analyse");});

// Create player post and get routes
app.get("/createplayer", (req, res) => {res.render("createplayer");});
app.post("/createplayer", playerController.createPlayer);

// Get auction data route.
app.get("/auctions/:auctionID", auctionController.getAuction);

// Buy auction route (delete)
app.post("/auctions/buy/:auctionID", auctionController.buyAuction);

// Delete auction route (from manage page)
app.post("/auctions/delete/:auctionID", auctionController.deleteAuction);

// Create auction route
app.post("/auctions/create", auctionController.createAuction);

// Login/logout routes.
app.get("/login", (req, res) => {res.render("login");});
app.post("/login", playerController.login);
app.get("/logout", (req, res) => {
	req.session.playerid = false;
	global.player = false;
	res.redirect("/");
});

// Serve the page icon.
var usersFilePath = path.join(__dirname, "favicon.ico");
app.get("/favicon.ico", function (req, res) {res.send(usersFilePath);});

// Listening.
app.listen(PORT, () => {console.log("App listening at http://localhost:" + PORT);});
