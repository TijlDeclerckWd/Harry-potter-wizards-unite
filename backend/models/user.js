var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongooseUniqueValidator = require('mongoose-unique-validator');


var schema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    username: {type: String},
    password: {type: String},
    email: {type: String, required: true, unique:true},
  house: {type: String, required: true, enum: ['Slytherin', 'Gryffindor', 'Hufflepuff', 'Ravenclaw']},
    registerDate: Date,
    birthDate: {type: Date, required: true},
    forumPosts: [{type: Schema.Types.ObjectId, ref: 'ForumPost'}],
    forumReplies: [{type:Schema.Types.ObjectId, ref: 'ForumReply'}],
    lastLogin: Date,
    role: String,
    profilePicture: {
        uploaded: {type: Boolean, default: false},
        name: {type: String, default: ''}
    },
    locationInfoShowed: {type: Boolean, default: false},
    locationSaved: {type: Boolean, default: false},
    country: {type: String, required: true}
}, { usePushEach: true });


schema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model('User', schema);
