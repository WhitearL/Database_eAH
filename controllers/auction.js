const Auction = require("../models/Auction");

// Create an auction
exports.createAuction = async (req, res) => {
  res.redirect("/?message=Not Implemented");
};

// List all auctions paginated
exports.listAuctions = async (req, res) => {

	const perPage = 10;
	const limit = parseInt(req.query.limit) || 10; // Make sure to parse the limit to number
	const page = parseInt(req.query.page) || 1;
	const message = req.query.message;


	try {
		const count = await Auction.find({}).count();
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


		console.log(matchedAuctions);

		res.send(JSON.stringify(matchedAuctions[0]));
	} catch (e) {
		res.send("Could not get auction by ID " + id);
	}
}

