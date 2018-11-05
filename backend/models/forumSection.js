var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {type: String, unique: true, required: true},
    description: {type: String, required: true},
    posts: [{type: Schema.Types.ObjectId, ref:'ForumPost'}],
    lastPost: {},
    totalPosts: {type:Number, default: 0},
    totalReplies: {type:Number, default:0}
}, { usePushEach: true });

module.exports = mongoose.model('Forum-section', schema);
