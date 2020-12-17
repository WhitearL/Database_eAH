const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema(
  {
    itemid: {
      type: Number,
      required: [true, "Item ID is required"],
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    url: {
        type: String,
        required: true,
        unique: false,
    }
  },
  { timestamps: false }
);

module.exports = mongoose.model("Item", itemSchema);
