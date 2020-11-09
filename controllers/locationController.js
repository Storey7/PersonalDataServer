var Location = require('../models/location');
var Event = require('../models/event');
var async = require('async');

const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all Location.
exports.location_list = function(req, res, next) {

  Location.find()
    .sort([['location', 'ascending']])
    .exec(function (err, list_locations) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('location_list', { title: 'Location List', list_locations:  list_locations});
    });

};

// Display detail page for a specific Location.
exports.location_detail = function(req, res, next) {

    async.parallel({
        location: function(callback) {
            Location.findById(req.params.id)
              .exec(callback);
        },

        location_events: function(callback) {
          Event.find({ 'location': req.params.id })
          .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.location==null) { // No results.
            var err = new Error('Location not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('location_detail', { title: 'Location Detail', location: results.location, location_events: results.location_events } );
    });

};

// Display Location create form on GET.
exports.location_create_get = function(req, res, next) {
    res.render('location_form', { title: 'Create Location'});
};

// Handle Location create on POST.
exports.location_create_post = [

    // Validate that the name field is not empty.
    body('location', 'Location name required').isLength({ min: 1 }).trim(),
    body('town', 'Town name required').isLength({ min: 1 }).trim(),
    body('country', 'Country name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('location').escape(),
    sanitizeBody('town').escape(),
    sanitizeBody('country').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a location object with escaped and trimmed data.
        var location = new Location(
            { 
                location: req.body.location,
                town: req.body.town,
                country: req.body.country,
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('location_form', { title: 'Create Location', location: location, errors: errors.array()});
            return;
        }
        else {
            // Data from form is valid.
            // Check if Location with same name already exists.
            Location.findOne({ 'location': req.body.location })
                .exec( function(err, found_location) {
                     if (err) { return next(err); }

                     if (found_location) {
                         // Location exists, redirect to its detail page.
                         res.redirect(found_location.url);
                     }
                     else {

                         location.save(function (err) {
                           if (err) { return next(err); }
                           // Location saved. Redirect to location detail page.
                           res.redirect(location.url);
                         });

                     }

                 });
        }
    }
];

// Display Location delete form on GET.
exports.location_delete_get = function(req, res, next) {

    async.parallel({
        location: function(callback) {
            Location.findById(req.params.id).exec(callback);
        },
        location_events: function(callback) {
            Event.find({ 'location': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.location==null) { // No results.
            res.redirect('/catalog/locations');
        }
        // Successful, so render.
        res.render('location_delete', { title: 'Delete Location', location: results.location, location_events: results.location_events } );
    });

};

// Handle Location delete on POST.
exports.location_delete_post = function(req, res, next) {

    async.parallel({
        location: function(callback) {
            Location.findById(req.params.id).exec(callback);
        },
        location_events: function(callback) {
            Event.find({ 'location': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        // Success
        if (results.location_events.length > 0) {
            // Location has events. Render in same way as for GET route.
            res.render('location_delete', { title: 'Delete Location', location: results.location, location_events: results.location_events } );
            return;
        }
        else {
            // Location has no events. Delete object and redirect to the list of locations.
            Location.findByIdAndRemove(req.body.id, function deleteLocation(err) {
                if (err) { return next(err); }
                // Success - go to locations list.
                res.redirect('/catalog/locations');
            });

        }
    });

};

// Display Location update form on GET.
exports.location_update_get = function(req, res, next) {

    Location.findById(req.params.id, function(err, location) {
        if (err) { return next(err); }
        if (location==null) { // No results.
            var err = new Error('Location not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('location_form', { title: 'Update Location', location: location });
    });

};

// Handle Location update on POST.
exports.location_update_post = [
   
    // Validate that the name field is not empty.
    body('location', 'Location name required').isLength({ min: 1 }).trim(),
    body('town', 'Town name required').isLength({ min: 1 }).trim(),
    body('country', 'Country name required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('location').escape(),
    sanitizeBody('town').escape(),
    sanitizeBody('country').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

    // Create a location object with escaped and trimmed data (and the old id!)
        var location = new Location(
          {
            location: req.body.location,
            town: req.body.town,
            country: req.body.country,
            _id: req.params.id
          }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('location_form', { title: 'Update Location', location: location, errors: errors.array()});
        return;
        }
        else {
            // Data from form is valid. Update the record.
            Location.findByIdAndUpdate(req.params.id, location, {}, function (err,thelocation) {
                if (err) { return next(err); }
                   // Successful - redirect to location detail page.
                   res.redirect(thelocation.url);
                });
        }
    }
];