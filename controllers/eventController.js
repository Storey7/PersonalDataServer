var Location = require('../models/location');
var Friend = require('../models/friend');
var Event = require('../models/event')
var async = require('async');

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all event.
exports.event_list = function (req, res, next) {

    Event.find()
        .sort([['date', 'ascending']])
        .populate('friend')
        .populate('location')
        .exec(function (err, list_events) {
            if (err) { return next(err); }
            else {
                // Successful, so render.
                res.render('event_list', { title: 'Event List', event_list: list_events });
            }
        });

};

// Display detail page for a specific event.
exports.event_detail = function (req, res, next) {

    async.parallel({
        event: function (callback) {
            Event.findById(req.params.id)
                .populate('location')
                .populate('location')
                .exec(callback);
        },

        friend_events: function (callback) {
            Friend.find({ 'event': req.params.id })
                .exec(callback);
        },

    }, function (err, results) {
        if (err) { return next(err); }
        if (results.events == null) { // No results.
            var err = new Error('event not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('event_detail', { title: 'Event Detail', event: results.event, event_friends: results.event_friends });
    });

};

// Display event create form on GET.
exports.event_create_get = function (req, res, next) {
    // Get all friends and locations, which we can use for adding to our book.
    async.parallel({
        friends: function(callback) {
            Friend.find(callback);
        },
        locations: function(callback) {
            Location.find(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        res.render('event_form', { title: 'Create Event',friends:results.friends, locations:results.locations });
    });

};

// Handle event create on POST.
exports.event_create_post = [

    // Convert the genre to an array.
    (req, res, next) => {
        if(!(req.body.friend instanceof Array)){
            if(typeof req.body.friend==='undefined')
            req.body.friend=[];
            else
            req.body.friend=new Array(req.body.friend);
        }
        next();
    },

    // Validate that the name field is not empty.
    body('Date', 'Event date required').isLength({ min: 1 }).trim(),

    // Sanitize (trim) the name field.
    sanitizeBody('date').escape(),
    sanitizeBody('friend.*').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a event object with escaped and trimmed data.
        var event = new Event(
            { 
                date: req.body.date,
                location: req.body.location,
                summary: req.body.summary,
                friend: req.body.friend,
                spent: req.body.spent,
                pints: req.body.pints,
                shots: req.body.shots,
                puke: req.body.puke,
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all friends and locations for form.
            async.parallel({
                friends: function(callback) {
                    Friend.find(callback);
                },
                locations: function(callback) {
                    Location.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }

                // Mark our selected locations as checked.
                for (let i = 0; i < results.locations.length; i++) {
                    if (event.location.indexOf(results.locations[i]._id) > -1) {
                        results.locations[i].checked='true';
                    }
                }
                res.render('event_form', { title: 'Create Event',friends:results.friends, locations:results.locations, event: event, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Save event.
            event.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new event record.
                   res.redirect(event.url);
                });
        }
    }
];

// Display event delete form on GET.
exports.event_delete_get = function (req, res, next) {

    async.parallel({
        event: function (callback) {
            Event.findById(req.params.id).exec(callback);
        },
        event_friends: function (callback) {
            Friends.find({ 'event': req.params.id }).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.event == null) { // No results.
            res.redirect('/catalog/events');
        }
        // Successful, so render.
        res.render('event_delete', { title: 'Delete Event', event: results.event, event_friends: results.event_events });
    });

};

// Handle event delete on POST.
exports.event_delete_post = function (req, res, next) {

    async.parallel({
        event: function (callback) {
            Event.findById(req.params.id).exec(callback);
        },
        event_events: function (callback) {
            Event.find({ 'event': req.params.id }).exec(callback);
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success
        if (results.event_friends.length > 0) {
            // event has events. Render in same way as for GET route.
            res.render('event_delete', { title: 'Delete Event', event: results.event, event_friends: results.event_friends });
            return;
        }
        else {
            // event has no events. Delete object and redirect to the list of events.
            Event.findByIdAndRemove(req.body.id, function deleteEvent(err) {
                if (err) { return next(err); }
                // Success - go to events list.
                res.redirect('/catalog/events');
            });

        }
    });

};

// Display event update form on GET.
exports.event_update_get = function (req, res, next) {

    Event.findById(req.params.id, function (err, event) {
        if (err) { return next(err); }
        if (event == null) { // No results.
            var err = new Error('Event not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('event_form', { title: 'Update Event', event: event });
    });

};

// Handle event update on POST.
exports.event_update_post = [

    // Validate that the name field is not empty.
    body('date', 'event date required').isLength({ min: 1 }).trim(),

    // Sanitize (escape) the name field.
    sanitizeBody('name').escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request .
        const errors = validationResult(req);

        // Create a event object with escaped and trimmed data (and the old id!)
        var event = new Event(
            {
                date: req.body.date,
                location: req.body.location,
                summary: req.body.summary,
                friend: req.body.friend,
                spent: req.body.spent,
                pints: req.body.pints,
                shots: req.body.shots,
                puke: req.body.puke,
            }
        );


        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('event_form', { title: 'Update Event', event: event, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Event.findByIdAndUpdate(req.params.id, event, {}, function (err, theevent) {
                if (err) { return next(err); }
                // Successful - redirect to event detail page.
                res.redirect(theevent.url);
            });
        }
    }
];