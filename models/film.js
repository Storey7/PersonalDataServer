var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var FilmSchema = new Schema(
{
    _id:{type: Schema.ObjectId, required: true},
    Name: {type: String, required: true},
    Letterboxd_url: {type: String, required: true},
    Date_Logged: {type: Date, required: true},
    Date_Rated: {type: Date, required: true},
    Year: {type: String, required: true},
    Rating: {type: Number, required: true},
}
);

//Virtual Schemas
FilmSchema
.virtual('Date_Logged_Formatted')
.get(function () {
  return moment(this.Date_Logged).format('MMMM Do, YYYY');
});

FilmSchema
.virtual('Date_Rated_Formatted')
.get(function () {
  return moment(this.Date_Rated).format('MMMM Do, YYYY');
});


module.exports = mongoose.model('FilmAttendee', FilmSchema, 'films_films');