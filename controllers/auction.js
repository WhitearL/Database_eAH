const Auction = require("../models/Auction");

exports.createAuction = async (req, res) => {
  res.redirect("/?message=Not Implemented");
};

exports.listAuctions = async (req, res) => {
  const perPage = 10;
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;

  try {
    const auctions = await Auction.find({})
      .skip(perPage * page - perPage)
      .limit(limit);

    var matched = [];
    const matchedPlayers = await Auction.aggregate([
      {
        $lookup: {
          from: "players",
          localField: "playerid",
          foreignField: "playerid",
          as: "player",
        },
      },
    ]).skip((perPage * page) - perPage).limit(limit);

    
    const count = await matchedPlayers.length;
    const numberOfPages = Math.ceil(count / perPage);

    res.render("browse", {
      auctions: matchedPlayers,
      numberOfPages: numberOfPages,
      currentPage: page,
    });
  } catch (e) {
    console.log(e);
    res.status(404).send({ message: "Could not list auctions" });
  }
};
