var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var Event = require('../models/event');
var Weight = require('../models/weight');
var Rubiks = require('../models/rubiktime');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        book_count: function(callback) {
            Book.countDocuments(callback);
        },
        author_count: function(callback) {
            Author.countDocuments(callback);
        },
        genre_count: function(callback) {
            Genre.countDocuments(callback);
        },
        event_count: function(callback){
            Event.countDocuments(callback);
        },
        weight_count: function(callback){
            Weight.countDocuments(callback);
        },
        rubiks_count: function(callback){
            Rubiks.countDocuments(callback);
        }
    }, function(err, results) {
        res.render('index', { title: 'Short Storeys', error: err, data: results });
    });
};