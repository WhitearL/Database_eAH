const { MongoClient } = require("mongodb");
const fs = require("fs").promises;
const path = require("path");
const loading = require("loading-cli");
const uri = "mongodb+srv://WhitearL:LpUUsA3YA9xShuM2@ahcluster.wlo2g.mongodb.net/AHDB?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function main() {
    try {

        // String constants.
        const aucCName = "auctions";
        const itemCName = "items";
        const aucFileName = "auctions.json";
        const itemFileName = "items.json";
        const stringEncoding = "utf8";

        // DB connection.
        await client.connect();
        const db = client.db();

        // If records exist then delete the current collections.
        const results = await db.collection(aucCName).find({}).count();
        if (results) {
            db.dropDatabase();
        }

        // Load indicator.
        const load = loading("Importing auction house data.").start();

        // Import auctions.
        const aucData = await fs.readFile(path.join(__dirname, aucFileName), stringEncoding);
        await db.collection(aucCName).insertMany(JSON.parse(aucData));

        // Import items.
        const itemData = await fs.readFile(path.join(__dirname, itemFileName), stringEncoding);
        await db.collection(itemCName).insertMany(JSON.parse(itemData));

        // Report success.
        load.stop();
        console.info("Auction data imported.");

    } catch (error) {
        // Error state. Report.
        console.error("Problem importing data: ", error);
    }

    process.exit();
}

main();
