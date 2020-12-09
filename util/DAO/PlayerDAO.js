var MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://WhitearL:LpUUsA3YA9xShuM2@ahcluster.wlo2g.mongodb.net/AHDB?retryWrites=true&w=majority";
const client = new MongoClient(url);

// Get number of currently saved users.
var getSavedUserCount = async function getSavedUserCount() {
    try {
        var conn = await MongoClient.connect(url);
        var dbo = conn.db("AHDB");
        var result = await dbo.collection("players").find({}).count();
        conn.close();
        return result;
    } catch (error) {
        // Error state. Report.
        console.error("Problem with user count operation.", error);
    }
};

module.exports.getSavedUserCount = getSavedUserCount;