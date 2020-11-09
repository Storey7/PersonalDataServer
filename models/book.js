var mongoose = require('mongoose');
var moment = require('moment')

var Schema = mongoose.Schema;

var BookSchema = new Schema(
  {
    title: {type: String, required: true},
    date: {type: Date, required: true},
    author: {type: Schema.Types.ObjectId, ref: 'Author', required: true},
    summary: {type: String},
    isbn: {type: String},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    cost: {type: Number}
  }
);

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return '/catalog/book/' + this._id;
});

BookSchema
.virtual('Date_Formatted')
.get(function () {
  return moment(this.date).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('Book', BookSchema);