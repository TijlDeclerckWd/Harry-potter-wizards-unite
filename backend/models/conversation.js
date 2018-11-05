var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    user1: {type: Schema.Types.ObjectId, ref: 'User'},
    user2: {type: Schema.Types.ObjectId, ref: 'User'},
    messages: [{
        date: Date,
        from: {type: Schema.Types.ObjectId, ref: 'User'},
        to: {type: Schema.Types.ObjectId, ref: 'User'},
        msg: String,
        seen: {type: Boolean, default: false}
    }],
    lastMsgCount: {type: Number, default: 0},
    newMessages: {
      receiver: {type: Schema.Types.ObjectId, ref: 'User'},
      count: {type: Number, default: 0}
    }
});

module.exports = mongoose.model('Conversation', schema);
