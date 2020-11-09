var mongoose = require('mongoose');
var moment = require('moment')

var schema = mongoose.Schema;

var WeightSchema = new Schema({
    date:{type: Date, default:Date.now},
    weight:{type: Number, required:true}
});

module.exports = mongoose.model('Weight', WeightSchema);