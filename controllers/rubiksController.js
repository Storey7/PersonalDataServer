var Rubiks = require('../models/rubiktime');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Rubiks.
exports.rubiks_list = function(req, res, next) {

  Rubiks.find()
    .sort([['date', 'ascending']])
    .exec(function (err, list_rubiks) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('Rubiks_list', { title: 'Rubiks List', rubiks_list:  list_rubiks});
    });

};

// Display detail page for a specific rubiks.
exports.rubiks_detail = function(req, res, next) {

    async.parallel({
        rubiks: function(callback) {
            Rubiks.findById(req.params.id)
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.rubiks==null) { // No results.
            var err = new Error('Rubiks not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('rubiks_detail', { title: 'Rubiks Detail', rubiks: results.rubiks} );
    });

};

exports.rubiks_chart = function(req, res, next){
    Rubiks(function(result){
        var date = result.date;
        var time = result.time;

        console.log(date, rubiks);
        res.render('myChart', {title: 'My Bar Chart', datai: JSON.stringify(time), labeli: JSON.stringify(date)} );
    })
};

// Display Rubiks create form on GET.
exports.rubiks_create_get = function(req, res) {
    res.render('rubiks_form', { title: 'Create Rubiks'});
};

// Handle Rubiks create on POST.
exports.rubiks_create_post = [

    // Validate that the name field is not empty.
    body('date', 'Rubiks date required').isLength({ min: 1 }).trim(),
    body('time', 'Rubiks time required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('rubiks').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a rubiks object with escaped and trimmed data.
        var rubiks = new Rubiks(
            {   
                date : req.body.date,
                time: req.body.time,
                toy: req.body.toy,
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('rubiks_form', { title: 'Create Rubiks', rubiks: rubiks, errors: errors.array()});
            return;
        }
        else {
            rubiks.save(function (err) {
            if (err) { return next(err); }
                // Weight saved. Redirect to weight detail page.
                res.redirect(rubiks.url);
            });
        }
    }
];

// Display Rubiks delete form on GET.
exports.rubiks_delete_get = function(req, res, next) {

    async.parallel({
        rubiks: function(callback) {
            Rubiks.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.rubiks==null) { // No results.
            res.redirect('/catalog/rubiks');
        }
        // Successful, so render.
        res.render('rubiks_delete', { title: 'Delete Rubiks', rubiks: results.rubiks} );
    });

};

// Handle Rubiks delete on POST.
exports.rubiks_delete_post = function(req, res, next) {

    async.parallel({
        rubiks: function(callback) {
            Rubiks.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        else {
            // Rubiks has no events. Delete object and redirect to the list of rubiks.
            Rubiks.findByIdAndRemove(req.body.id, function deleteRubiks(err) {
                if (err) { return next(err); }
                // Success - go to rubiks list.
                res.redirect('/catalog/rubiks');
            });

        }
    });

};

// Display Rubiks update form on GET.
exports.rubiks_update_get = function(req, res, next) {

    Rubiks.findById(req.params.id, function(err, rubiks) {
        if (err) { return next(err); }
        if (rubiks==null) { // No results.
            var err = new Error('Rubiks not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('rubiks_form', { title: 'Update Rubiks', rubiks: rubiks });
    });

};

// Handle Rubiks update on POST.
exports.rubiks_update_post = [
   
    // Validate that the name field is not empty.
    body('date', 'Rubiks date required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('time').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a rubiks object with escaped and trimmed data (and the old id!)
        var rubiks = new Rubiks(
          {
            date :req.body.date,
            time: req.body.time,
            _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('rubiks_form', { title: 'Update Rubiks', rubiks: rubiks, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Rubiks.findByIdAndUpdate(req.params.id, rubiks, {}, function (err,therubiks) {
                if (err) { return next(err); }
                   // Successful - redirect to rubiks detail page.
                   res.redirect(therubiks.url);
                });
        }
    }
];