const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI ) {
    console.error("Missing MONGODB_URI in environment variables.");
    process.exit(1);
}

mongoose.connect(`${MONGODB_URI}`).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

module.exports = mongoose.connection;