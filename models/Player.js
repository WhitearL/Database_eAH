const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const playerSchema = new Schema(
    {
        playerid: { type: Number, required: [true, 'Player ID is required'], unique: true },
        username: { type: String, required: [true, 'Username is required'], unique: true },
        password: { type: String, required: [true, 'Password is required'] }
    },
    { timestamps: false }
);

playerSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, 4);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('Could not hash password.');
    }
})

module.exports = mongoose.model("Player", playerSchema);