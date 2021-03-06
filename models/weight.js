var mongoose = require('mongoose');
var moment = require('moment')

var Schema = mongoose.Schema;

var WeightSchema = new Schema({
    date:{type: Date, default:Date.now},
    weight:{type: Number, required:true}
});

// Virtual for weight's URL
WeightSchema
.virtual('url')
.get(function () {
  return '/catalog/weight/' + this._id;
});

WeightSchema
.virtual('Date_Formatted')
.get(function () {
  return moment(this.date).format('DD MMM YYYY');
});

module.exports = mongoose.model('Weight', WeightSchema);