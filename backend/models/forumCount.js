var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    guests: Number,
    registered: Number,
    highestNumber: {
        num: Number,
        date: Date
    }
});

module.exports = mongoose.model('ForumCount', schema);