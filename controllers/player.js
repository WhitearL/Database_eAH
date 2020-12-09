const Player = require("../models/Player");
const PlayerDAO = require("../util/DAO/PlayerDAO");

exports.createPlayer = async (req, res) => {
    try {
        const player = new Player({
            playerid: await PlayerDAO.getSavedUserCount() + 1,
            username: req.body.username,
            password: req.body.password
        });

        await player.save();
        res.send("Player created!")
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.send("Error creating player.");
            return;
        }

        console.log(e);
        return res.status(500).send("Player could not be created.");
    }
}