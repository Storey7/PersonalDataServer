var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var LocationSchema = new Schema({
    location: {type: String, required: true},
    town: {type:String, required: true},
    country: {type: String, required: true}
});

// Virtual for this genre instance URL.
LocationSchema
.virtual('url')
.get(function () {
  return '/catalog/location/'+this._id;
});

// Export model.
module.exports = mongoose.model('Location', LocationSchema);