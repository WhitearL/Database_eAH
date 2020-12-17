const mongoose = require("mongoose");
const { Schema } = mongoose;

const auctionSchema = new Schema(
  {
    auctionid: {
      type: Number,
      required: [true, "Auction ID is required"],
      unique: true,
    },
    playerid: {
      type: Number,
      required: [true, "Player ID is required"],
      unique: false,
    },
    itemid: {
      type: Number,
      required: [true, "Item ID is required"],
      unique: false,
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      unique: false,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      unique: false,
    },
    minbid: {
      type: Number,
      required: false,
      unique: false,
    },
    buyout: {
      type: Number,
      required: [true, "Buyout price is required"],
      unique: false,
    },
  },
  { timestamps: false }
);

module.exports = mongoose.model("Auction", auctionSchema);
