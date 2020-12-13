const Player = require("../models/Player");

exports.createPlayer = async (req, res) => {
    try {
		var playerid = db.yourCollectionName.find().sort({"playerid":-1}).limit(1);
		
        const player = new Player({ playerid: req.body.password });
        await player.save();
        res.redirect('/?message=Player created')
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('create-player', { errors: e.errors })
            return;
        }
        console.log(e);
        return res.status(400).send({
            message: 'Could not save player',
        });
    }
}