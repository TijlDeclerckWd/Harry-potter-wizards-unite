var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    latitude: Number,
    longitude: Number,
    user: {type: Schema.Types.ObjectId, ref:'User'},
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Location', schema);

