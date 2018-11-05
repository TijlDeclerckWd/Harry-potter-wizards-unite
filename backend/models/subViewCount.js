var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    section: String,
    views: Number
});

module.exports = mongoose.model('SubViewCount', schema);