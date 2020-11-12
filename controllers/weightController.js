var Weight = require('../models/weight');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Weight.
exports.weight_list = function(req, res, next) {

  Weight.find()
    .sort([['date', 'ascending']])
    .exec(function (err, list_weights) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('Weight_list', { title: 'Weight List', weight_list:  list_weights});
    });

};

// Display detail page for a specific weight.
exports.weight_detail = function(req, res, next) {

    async.parallel({
        weight: function(callback) {
            Weight.findById(req.params.id)
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.weight==null) { // No results.
            var err = new Error('Weight not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('weight_detail', { title: 'Weight Detail', weight: results.weight} );
    });

};

exports.weight_chart = function(req, res, next){
    Weight(function(result){
        var date = result.date;
        var weight = result.weight;

        console.log(date, weight);
        res.render('myChart', {title: 'My Bar Chart', datai: JSON.stringify(weight), labeli: JSON.stringify(date)} );
    })
};

// Display Weight create form on GET.
exports.weight_create_get = function(req, res) {
    res.render('weight_form', { title: 'Create Weight'});
};

// Handle Weight create on POST.
exports.weight_create_post = [

    // Validate that the name field is not empty.
    body('weight', 'Weight name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('weight').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a weight object with escaped and trimmed data.
        var weight = new Weight(
            {   
                date : req.body.date,
                weight: req.body.weight,
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('weight_form', { title: 'Create Weight', weight: weight, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Weight with same name already exists.
            Weight.findOne({ 'weight': req.body.weight })
                .exec( function(err, found_weight) {
                     if (err) { return next(err); }

                     if (found_weight) {
                         // Weight exists, redirect to its detail page.
                         res.redirect(found_weight.url);
                     }
                     else {

                         weight.save(function (err) {
                           if (err) { return next(err); }
                           // Weight saved. Redirect to weight detail page.
                           res.redirect(weight.url);
                         });

                     }

                 });
        }
    }
];

// Display Weight delete form on GET.
exports.weight_delete_get = function(req, res, next) {

    async.parallel({
        weight: function(callback) {
            Weight.findById(req.params.id).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.weight==null) { // No results.
            res.redirect('/catalog/weights');
        }
        // Successful, so render.
        res.render('weight_delete', { title: 'Delete Weight', weight: results.weight} );
    });

};

// Handle Weight delete on POST.
exports.weight_delete_post = function(req, res, next) {

    async.parallel({
        weight: function(callback) {
            Weight.findById(req.params.id).exec(callback);
        }
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        else {
            // Weight has no events. Delete object and redirect to the list of weights.
            Weight.findByIdAndRemove(req.body.id, function deleteWeight(err) {
                if (err) { return next(err); }
                // Success - go to weights list.
                res.redirect('/catalog/weights');
            });

        }
    });

};

// Display Weight update form on GET.
exports.weight_update_get = function(req, res, next) {

    Weight.findById(req.params.id, function(err, weight) {
        if (err) { return next(err); }
        if (weight==null) { // No results.
            var err = new Error('Weight not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('weight_form', { title: 'Update Weight', weight: weight });
    });

};

// Handle Weight update on POST.
exports.weight_update_post = [
   
    // Validate that the name field is not empty.
    body('weight', 'Weight name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('weight').escape(),


    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a weight object with escaped and trimmed data (and the old id!)
        var weight = new Weight(
          {
            date :req.body.date,
            weight: req.body.weight,
            _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('weight_form', { title: 'Update Weight', weight: weight, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Weight.findByIdAndUpdate(req.params.id, weight, {}, function (err,theweight) {
                if (err) { return next(err); }
                   // Successful - redirect to weight detail page.
                   res.redirect(theweight.url);
                });
        }
    }
];