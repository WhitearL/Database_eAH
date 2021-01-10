const Player = require("../models/Player");
const bcrypt = require('bcrypt');

exports.createPlayer = async (req, res) => {
    try {
		var latestPlayer = await Player.findOne().sort({"playerid":-1});
		var newPlayerID = latestPlayer.playerid + 1;

		// Check if the username already exists
		var existingPlayers = await Player.find({username: req.body.username});

		// Find returns an array. If the array has no elements, then no existing players with that name were found.
		if(existingPlayers.length > 0) {
			return res.status(500).send({message: "You could not be signed up. That username is already registered.",});
		} else {			
			
			// Save as normal.
		    const newPlayer = new Player({ 
				playerid: newPlayerID,
				username: req.body.username,
				password: req.body.password
			});
			
			const savedPlayer = await newPlayer.save();
			
			// Check the player was saved correctly, by checking the save return value against the player we gave it.
			if (newPlayer === savedPlayer) {
				//200 OK
				req.session.playerid = player.playerid; // Set session
				return res.status(200).send({message: "You have been signed up.",});
			} else {
				// Error state.
				return res.status(500).send({message: "You could not be signed up. Ensure your details are valid.",});
			}
		}
        
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
			return res.status(500).send({message: e,});
        }
        return res.status(400).send({ message: 'Could not save player',});
    }
}

exports.login = async (req, res) => {
    try {
        const player = await Player.findOne({ username: req.body.username });
        
		if (!player) {
			return res.status(403).send({message: "Player " + req.body.username + " not registered.",});
        }

        const passwordValid = await bcrypt.compare(req.body.password, player.password);
        
        if (passwordValid) {
			//200 OK
			req.session.playerid = player.playerid; // Set session
			return res.status(200).send({
				message: "Correct username/password.",
			});
        } else {
			//403 forbidden.
			return res.status(403).send({
				message: "Incorrect username/password.",
			});
		}


    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
			return res.status(500).send({message: e,});
        }
        return res.status(400).send({ message: 'Could not save player',});
    }
}
