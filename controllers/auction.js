const Auction = require("../models/Auction");
const Item = require("../models/Item");

// Create an auction
exports.createAuction = async (req, res) => {
  res.redirect("/?message=Not Implemented");
};

// List all auctions paginated
exports.listAuctions = async (req, res) => {
	
	if (req.session.playerid) {
		const perPage = 10;
		const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
		const page = parseInt(req.query.page) || 1;
		const message = req.query.message;

		try {
			const count = await Auction.find({}).countDocuments();
			const numberOfPages = Math.ceil(count / perPage);

			const auctions = await Auction.aggregate([
			
				{$lookup: {from: "players", localField: "playerid", foreignField: "playerid", as: "player"},},
				{$lookup: {from: "items", localField: "itemid", foreignField: "itemid", as: "item"},}
			
			]).skip((perPage * page) - perPage).limit(limit);

			res.render("browse", {
				auctions : auctions,
				numberOfPages: numberOfPages,
				currentPage: page,
				message: message
			});

		} catch (e) {
			res.status(404).send({ message: "Could not list auctions" });
		}
	} else {
		res.render("common/loginwarning");
	}
};

// List all auctions paginated
exports.listPlayerAuctions = async (req, res) => {
	
	var id = Number(req.params.playerid);
	
	if (req.session.playerid && req.params.playerid && (req.session.playerid === id)) {
		const perPage = 10;
		const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
		const page = parseInt(req.query.page) || 1;
		const message = req.query.message;

		try {
			const count = await Auction.find({}).countDocuments();
			const numberOfPages = Math.ceil(count / perPage);

			const auctions = await Auction.aggregate([
			
				{$match:  {playerid : id} },
				{$lookup: {from: "players", localField: "playerid", foreignField: "playerid", as: "player"},},
				{$lookup: {from: "items", localField: "itemid", foreignField: "itemid", as: "item"},}
			
			]).skip((perPage * page) - perPage).limit(limit);

			res.render("manage", {
				auctions : auctions,
				numberOfPages: numberOfPages,
				currentPage: page,
				message: message
			});

		} catch (e) {
			res.status(404).send({ message: "Could not list auctions" });
		}
	} else {
		res.render("common/loginwarning");
	}
};

// Return JSON of auction by id if it exists.
exports.getAuction = async (req, res) => {
	var id = Number(req.params.auctionID);
	
	try {			
		
		var matchedAuctions = await Auction.aggregate([
			{ "$match": {auctionid : id} },
			{ 
				"$lookup": { 
					"from": 'players', 
					"localField": 'playerid', 
					"foreignField": 'playerid', 
					"as": 'player' 
				} 
			},
			{ 
				"$lookup": { 
					"from": 'items', 
					"localField": 'itemid', 
					"foreignField": 'itemid', 
					"as": 'item' 
				} 
			}
		])

		res.send(JSON.stringify(matchedAuctions[0]));
	} catch (e) {
		res.send("Could not get auction by ID " + id);
	}
}

exports.buyAuction = async (req, res) => {
	
	if (req.session.playerid) {
		var id = Number(req.params.auctionID);

		try {

			var result = await Auction.deleteOne( { auctionid: id } );
			
			if (result.deletedCount >= 1) {
				res.status(200).send({message: `Auction ${id} purchased`,});
			} else {
				res.status(404).send({message: `Could not buy auction ${id}.`,});
			}
			
		} catch (e) {
			res.status(404).send({message: `Could not buy auction ${id}.`,});
		}
	} else {
		res.render("common/loginwarning");
	}
}

exports.deleteAuction = async (req, res) => {
	
	if (req.session.playerid) {
		var id = Number(req.params.auctionID);

		try {

			var result = await Auction.deleteOne( { auctionid: id } );
			
			if (result.deletedCount >= 1) {
				res.status(200).send({message: `Auction ${id} deleted`,});
			} else {
				res.status(404).send({message: `Could not delete auction ${id}.`,});
			}
			
		} catch (e) {
			res.status(404).send({message: `Could not delete auction ${id}.`,});
		}
	} else {
		res.render("common/loginwarning");
	}
}

exports.createAuction = async (req, res) => {
	
	if (req.session.playerid) {

		try {
			
			var item = await Item.findOne({"itemid" : req.body.itemid});
			
			if (item != null) {
				var latestAuction = await Auction.findOne().sort({"auctionid":-1});
				var newAuctionID = latestAuction.auctionid + 1;

				// Save as normal.
				const newAuction = new Auction({ 
					auctionid: newAuctionID,
					playerid: req.body.playerid,
					itemid: req.body.itemid,
					quantity: req.body.quantity,
					buyout: req.body.buyout
				});
				
				const savedAuction = await newAuction.save();
				
				// Check the player was saved correctly, by checking the save return value against the player we gave it.
				if (newAuction === savedAuction) {
					//200 OK
					return res.status(200).send({message: "Auction " + newAuctionID + " has been created.",});
				} else {
					// Error state.
					return res.status(500).send({message: "Your auction could not be created. Ensure your details are valid.",});
				}
			} else {
				return res.status(404).send({message: "Item by id " + req.body.itemid + " does not exist",});
			}
			
		} catch (e) {
			if (e.errors) {
				console.log(e.errors);
				return res.status(500).send({message: e,});
			}
			return res.status(400).send({ message: e,});
		}

	} else {
		res.render("common/loginwarning");
	}
	
}

exports.editAuction = async (req, res) => {
			
	if (req.session.playerid) {

		try {
					
			var item = await Item.findOne({"itemid" : req.body.itemid});
				
			if (item != null) {
				
				var before = await Auction.findOne({ "auctionid" : req.params.auctionid });
						
				await Auction.updateOne(
					{ 
						"auctionid" : req.params.auctionid
					},
					{
						"itemid": req.body.itemid,
						"quantity": req.body.quantity,
						"buyout": req.body.buyout
					}
				);
				
				var after = await Auction.findOne({ "auctionid" : req.params.auctionid });
				
				// Check the auction was saved correctly, by checking the save return value against the auction we gave it.
				if (before != after) {
					//200 OK
					return res.status(200).send({message: "Auction " + req.params.auctionid + " has been edited.",});
				} else {
					// Error state.
					return res.status(200).send({message: "The update operation succeeded, but no values were changed.",});
				}
				
			} else {
				return res.status(404).send({message: "Item by id " + req.body.itemid + " does not exist",});
			}
			
		} catch (e) {
			console.log(e);
			if (e.errors) {
				console.log(e.errors);
				return res.status(500).send({message: e,});
			}
			return res.status(400).send({ message: e,});
		}

	} else {
		res.render("common/loginwarning");
	}
	
}