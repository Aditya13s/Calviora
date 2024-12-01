const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/Calviora").then(_ => {
    console.log("Connected to mongodb");
}).catch(err => {
    console.log(err);
});

module.exports = mongoose.connection;