var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    content: String,
    post: {type: Schema.Types.ObjectId, ref:'ForumPost'},
    date: {type: Date, default: Date.now},
    quote: {type: {}, default: {selected: false, obj: {username: null, content: null}}}
}, { usePushEach: true });

module.exports = mongoose.model('ForumReply', schema);
