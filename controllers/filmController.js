const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Film = require('../models/film.js');
var async = require('async');

// Display list of all films.
exports.film_list = function(req, res) {  
    Film.find({})
        .sort([['Date_Logged','ascending'], ['Year', 'ascending']])
      .exec(function (err, list_films) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('film_list', { title: 'Film List', film_list: list_films });
      });
};

// Display detail page for a specific film.
exports.film_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: film detail: ' + req.params.id);
};

// Display film create form on GET.
exports.film_create_get = function(req, res) {
    // Get all authors and genres, which we can use for adding to our film.
    async.parallel({
       
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('film_form', { title: 'Create film'});
    });
};

// Handle film create on POST.
exports.film_create_post = [
    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.genre instanceof Array)){
            if(typeof req.body.genre==='undefined')
            req.body.genre=[];
            else
            req.body.genre=new Array(req.body.genre);
        }
        next();
    },

    // Validate fields.
    body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
    body('author', 'Author must not be empty.').isLength({ min: 1 }).trim(),
    body('summary', 'Summary must not be empty.').isLength({ min: 1 }).trim(),
    body('isbn', 'ISBN must not be empty').isLength({ min: 1 }).trim(),
    
    // Sanitize fields (using wildcard).
    sanitizeBody('*').trim().escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a film object with escaped and trimmed data.
        var film = new film(
            { title: req.body.title,
            author: req.body.author,
            summary: req.body.summary,
            isbn: req.body.isbn,
            genre: req.body.genre
            });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all authors and genres for form.
        }
        else {
            // Data from form is valid. Save film.
            film.save(function (err) {
                if (err) { return next(err); }
                    //successful - redirect to new film record.
                    res.redirect(film.url);
                });
        }
    }
];


// Display film delete form on GET.
exports.film_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: film delete GET');
};

// Handle film delete on POST.
exports.film_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: film delete POST');
};

// Display film update form on GET.
exports.film_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: film update GET');
};

// Handle film update on POST.
exports.film_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: film update POST');
};