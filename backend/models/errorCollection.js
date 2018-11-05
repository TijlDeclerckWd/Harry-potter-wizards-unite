let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
  serverErrors: {type: Array, default: []},
  clientErrors: {type: Array, default: []}
}, { usePushEach: true });

module.exports = mongoose.model('ErrorCollection', schema);
