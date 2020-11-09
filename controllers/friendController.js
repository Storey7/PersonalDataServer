var Friend = require("../models/friend")
var async = require('async')
var Event = require("../models/event")

const { body, validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

exports.friend_list = function (req, res, next) {

    Friend.find()
        .sort([['name', 'ascending']])
        .populate()
        .exec(function (err, list_friends) {
            if (err) { return next(err); }
            // Successful, so render.
            res.render('friend_list', { title: 'Friend List', friend_list: list_friends });
        })
};

exports.friend_detail = function(req, res, next){
    async.parallel({
        friend: function (callback) {
            Friend.findById(req.params.id)
                .exec(callback)
        },
        // Add friend_events here
    }, function (err, results) {
        if (err) { return next(err); } // Error in API usage.
        if (results.friend == null) { // No results.
            var err = new Error('Friend not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('friend_detail', { title: 'Friend Detail', friend: results.friend});
    });

};

// Display Friend create form on GET.
exports.friend_create_get = function (req, res, next) {
    res.render('friend_form', { title: 'Create Friend' });
}

exports.friend_create_post = [
    // Validate fields.
    //body('name').isLength({ min: 1 }).withMessage('Name must be specified.')
        //.isAlphanumeric().withMessage('Name has non-alphanumeric characters.'),
    body('known_since', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('known_since').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create friend object with escaped and trimmed data
        var friend = new Friend(
            {
                name: req.body.name,
                known_since: req.body.known_since,
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('friend_form', { title: 'Create Friend', friend: friend, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save friend.
            friend.save(function (err) {
                if (err) { return next(err); }
                // Successful - redirect to new friend record.
                res.redirect(friend.url);
            });
        }
    }
];


// Display Friend delete form on GET.
exports.friend_delete_get = function(req, res) {
    async.parallel({
        friend: function (callback) {
            Friend.findById(req.params.id).exec(callback)
        },
        friends_events: function (callback) {
            Event.find({ 'friend': req.params.id }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        if (results.friend == null) { // No results.
            res.redirect('/catalog/friends');
        }
        // Successful, so render.
        res.render('friend_delete', { title: 'Delete Friend', friend: results.friend, friend_events: results.friends_events });
    });

};

// Handle Friend delete on POST.
exports.friend_delete_post = function(req, res) {
    async.parallel({
        friend: function (callback) {
            Friend.findById(req.body.friendid).exec(callback)
        },
        friends_events: function (callback) {
            Event.find({ 'friend': req.body.friendid }).exec(callback)
        },
    }, function (err, results) {
        if (err) { return next(err); }
        // Success.
        if (results.friends_events.length > 0) {
            // Friend has events. Render in same way as for GET route.
            res.render('friend_delete', { title: 'Delete Friend', friend: results.friend, friend_events: results.friends_events });
            return;
        }
        else {
            // Friend has no events. Delete object and redirect to the list of friends.
            Friend.findByIdAndRemove(req.body.friendid, function deleteFriend(err) {
                if (err) { return next(err); }
                // Success - go to friend list.
                res.redirect('/catalog/friends')
            })

        }
    });

};

// Display Friend update form on GET.
exports.friend_update_get = function(req, res) {
    Friend.findById(req.params.id, function (err, friend) {
        if (err) { return next(err); }
        if (friend == null) { // No results.
            var err = new Error('Friend not found');
            err.status = 404;
            return next(err);
        }
        // Success.
        res.render('friend_form', { title: 'Update Friend', friend: friend });

    });
};

// Handle Friend update on POST.
exports.friend_update_post = [
    // Validate fields.
    //body('name').isLength({ min: 1 }).withMessage('Name must be specified.')
        //.isAlphanumeric().withMessage('Name has non-alphanumeric characters.'),
    body('known_since', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

    // Sanitize fields.
    sanitizeBody('name').escape(),
    sanitizeBody('known_since').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);
        
        // Create friend object with escaped and trimmed data
        var friend = new Friend(
            {
                name: req.body.name,
                known_since: req.body.known_since,
                _id: req.params.id
            }
        );

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('friend_form', { title: 'Update Friend', friend: friend, errors: errors.array() });
            return;
        }
        else {
            // Data from form is valid.

            // Save friend.
            Friend.findByIdAndUpdate(req.params.id, friend, {}, function (err, thefriend) {
                if (err) { return next(err); }
                // Successful - redirect
                res.redirect(thefriend.url);
            });
        }
    }
];