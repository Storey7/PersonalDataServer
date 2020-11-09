var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EventSchema = new Schema(
  {
    date: {type: Date, required: true},
    location: {type: Schema.Types.ObjectId, ref: 'Location', required: true},
    summary: {type: String},
    friend: [{type: Schema.Types.ObjectId, ref: 'Friend'}],
    spent: {type: Number},
    pints:{type: Number},
    shots:{type: Number},
    puke:{type: Boolean}
  }
);

EventSchema
.virtual('url')
.get(function () {
  return '/catalog/event/'+this._id;
});

//Export model
module.exports = mongoose.model('Event', EventSchema);