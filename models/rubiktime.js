var mongoose = require('mongoose');

var mongoose = require('mongoose');
var moment = require('moment')

var schema = mongoose.Schema;

var RubiksSchema = new Schema({
    date:{type: Date, default: Date.now, required:true},
    time:{type: Date, required:true},
    toy:{type: String, required:true}
});

module.exports = mongoose.model('Rubiks', RubiksSchema);