var mongoose = require('mongoose');
var moment = require('moment')

var Schema = mongoose.Schema;

var RubiksSchema = new Schema({
    date:{type: Date, default: Date.now, required:true},
    time:{type: Number, required:true},
    toy:{type: String, required:true}
});

// Virtual for weight's URL
RubiksSchema
.virtual('url')
.get(function () {
  return '/catalog/rubiks/' + this._id;
});

RubiksSchema
.virtual('Date_Formatted')
.get(function () {
  return moment(this.date).format('DD MMM YYYY');
});

module.exports = mongoose.model('Rubiks', RubiksSchema);