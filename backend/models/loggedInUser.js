let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('LoggedInUser', schema);
