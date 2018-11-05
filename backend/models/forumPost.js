var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref:'User'},
    title: String,
    content: String,
    category: String,
    replies: [{type:Schema.Types.ObjectId, ref:'ForumReply'}],
    date: {type: Date, default: Date.now},
    totalReplies: {type:Number, default:0},
    totalViews: {type:Number, default:0}
}, { usePushEach: true });

module.exports = mongoose.model('ForumPost', schema);
