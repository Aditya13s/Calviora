const mongoose = require('mongoose');
const config = require('config');
const debug = require('debug')('development:mongoose');

mongoose.connect(`${config.get("MONGODB_URI")}/Calviora`).then(_ => {
    debug("Connected to mongodb");
}).catch(err => {
    console.log(err);
});

module.exports = mongoose.connection;