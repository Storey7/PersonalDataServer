var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var FriendSchema = new Schema({
    name: {type: String, required: true},
    known_since: {type: Date}
});

// Virtual for this friend instance URL.
FriendSchema
.virtual('url')
.get(function () {
  return '/catalog/friend/'+this._id;
});

// Export model.
module.exports = mongoose.model('Friend', FriendSchema);