var express = require('express');
var router = express.Router();

// Require controller modules.
var index_controller = require('../controllers/indexController');
var book_controller = require('../controllers/bookController');
var author_controller = require('../controllers/authorController');
var genre_controller = require('../controllers/genreController');
var filmController = require('../controllers/filmController')
var eventController = require('../controllers/eventController')
var friendController = require("../controllers/friendController")
var locationController = require("../controllers/locationController")
var weightController = require("../controllers/weightController")

/// BOOK ROUTES ///

// GET catalog home page.
router.get('/', index_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/book/create', book_controller.book_create_get);

// POST request for creating Book.
router.post('/book/create', book_controller.book_create_post);

// GET request to delete Book.
router.get('/book/:id/delete', book_controller.book_delete_get);

// POST request to delete Book.
router.post('/book/:id/delete', book_controller.book_delete_post);

// GET request to update Book.
router.get('/book/:id/update', book_controller.book_update_get);

// POST request to update Book.
router.post('/book/:id/update', book_controller.book_update_post);

// GET request for one Book.
router.get('/book/:id', book_controller.book_detail);

// GET request for list of all Book items.
router.get('/books', book_controller.book_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get('/author/create', author_controller.author_create_get);

// POST request for creating Author.
router.post('/author/create', author_controller.author_create_post);

// GET request to delete Author.
router.get('/author/:id/delete', author_controller.author_delete_get);

// POST request to delete Author.
router.post('/author/:id/delete', author_controller.author_delete_post);

// GET request to update Author.
router.get('/author/:id/update', author_controller.author_update_get);

// POST request to update Author.
router.post('/author/:id/update', author_controller.author_update_post);

// GET request for one Author.
router.get('/author/:id', author_controller.author_detail);

// GET request for list of all Authors.
router.get('/authors', author_controller.author_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get('/genre/create', genre_controller.genre_create_get);

//POST request for creating Genre.
router.post('/genre/create', genre_controller.genre_create_post);

// GET request to delete Genre.
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

// GET request to update Genre.
router.get('/genre/:id/update', genre_controller.genre_update_get);

// POST request to update Genre.
router.post('/genre/:id/update', genre_controller.genre_update_post);

// GET request for one Genre.
router.get('/genre/:id', genre_controller.genre_detail);

// GET request for list of all Genre.
router.get('/genres', genre_controller.genre_list);

/// FILM ROUTES ///

// GET request for creating a film. NOTE This must come before route that displays film (uses id).
router.get('/film/create', filmController.film_create_get);

//POST request for creating film.
router.post('/film/create', filmController.film_create_post);

// GET request to delete film.
router.get('/film/:id/delete', filmController.film_delete_get);

// POST request to delete film.
router.post('/film/:id/delete', filmController.film_delete_post);

// GET request to update film.
router.get('/film/:id/update', filmController.film_update_get);

// POST request to update film.
router.post('/film/:id/update', filmController.film_update_post);

// GET request for one film.
router.get('/film/:id', filmController.film_detail);

// GET request for list of all film.
router.get('/films', filmController.film_list);

/// Event ROUTES ///

// GET request for creating a event. NOTE This must come before route that displays event (uses id).
router.get('/event/create', eventController.event_create_get);

//POST request for creating event.
router.post('/event/create', eventController.event_create_post);

// GET request to delete event.
router.get('/event/:id/delete', eventController.event_delete_get);

// POST request to delete event.
router.post('/event/:id/delete', eventController.event_delete_post);

// GET request to update event.
router.get('/event/:id/update', eventController.event_update_get);

// POST request to update event.
router.post('/event/:id/update', eventController.event_update_post);

// GET request for one event.
router.get('/event/:id', eventController.event_detail);

// GET request for list of all event.
router.get('/events', eventController.event_list);

// Friend Routes
// GET request for creating a event. NOTE This must come before route that displays event (uses id).
router.get('/friend/create', friendController.friend_create_get);

//POST request for creating friend.
router.post('/friend/create', friendController.friend_create_post);

// GET request to delete friend.
router.get('/friend/:id/delete', friendController.friend_delete_get);

// POST request to delete friend.
router.post('/friend/:id/delete', friendController.friend_delete_post);

// GET request to update friend.
router.get('/friend/:id/update', friendController.friend_update_get);

// POST request to update friend.
router.post('/friend/:id/update', friendController.friend_update_post);

// GET request for one friend.
router.get('/friend/:id', friendController.friend_detail);

// GET request for list of all friend.
router.get('/friends', friendController.friend_list);

// Location Routes
// GET request for creating a event. NOTE This must come before route that displays event (uses id).
router.get('/location/create', locationController.location_create_get);

//POST request for creating location.
router.post('/location/create', locationController.location_create_post);

// GET request to delete location.
router.get('/location/:id/delete', locationController.location_delete_get);

// POST request to delete location.
router.post('/location/:id/delete', locationController.location_delete_post);

// GET request to update location.
router.get('/location/:id/update', locationController.location_update_get);

// POST request to update location.
router.post('/location/:id/update', locationController.location_update_post);

// GET request for one location.
router.get('/location/:id', locationController.location_detail);

// GET request for list of all location.
router.get('/locations', locationController.location_list);

// Weight Routes
// GET request for creating a event. NOTE This must come before route that displays event (uses id).
router.get('/weight/create', weightController.weight_create_get);

//POST request for creating weight.
router.post('/weight/create', weightController.weight_create_post);

// GET request to delete weight.
router.get('/weight/:id/delete', weightController.weight_delete_get);

// POST request to delete weight.
router.post('/weight/:id/delete', weightController.weight_delete_post);

// GET request to update weight.
router.get('/weight/:id/update', weightController.weight_update_get);

// POST request to update weight.
router.post('/weight/:id/update', weightController.weight_update_post);

// GET request for one weight.
router.get('/weight/:id', weightController.weight_detail);

// GET request for list of all weight.
router.get('/weights', weightController.weight_list);

// GET request for chart of all weights.
router.get('/weight/chart', weightController.weight_chart);

// Rubiks Routes

module.exports = router;