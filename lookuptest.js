const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const uri = "mongodb+srv://WhitearL:LpUUsA3YA9xShuM2@ahcluster.wlo2g.mongodb.net/AHDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);


async function main() {
    await client.connect();
    const db = client.db();

    // Load indicator.
    const load = loading("Importing auction house data.").start();

	await db.auctions.updateMany({},{$unset: {duration:1}},{multi: true});

    // Report success.
    load.stop();
    console.info("Auction data imported.");
}

main();