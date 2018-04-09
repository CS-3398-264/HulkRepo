// UserController.js
// This is the bare layout of the user controller

// Express router used tocreate a subset of routes 
// which can be modular and independent from the whole app
var express = require('express');
var router = express.Router();

// Body parser is middleware to handle data in an elegant way.
// This'll be handy when sending data through HTTP requests using forms
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// Whenever you create a model like you did in user.js, it automagically 
// receives all the necessary methods for interacting with 
// a database, including create, read, update and delete actions
var User = require('./User');
module.exports = router;

// CREATES A NEW USER -- FOR WHEN ADMIN, OR WHEN USER CREATES AN ACCOUNT WITH NUBER
router.post('/', function (req, res) {
	User.create({
		name: req.body.name,
		needPickup: req.body.needPickup,
		longitude: req.body.longitude,
		latitude: req.body.latitude,
		rating: req.body.rating
	},
        function (err, user) {
        	if (err) return res.status(500).send("There was a problem adding the information to the database.");
        	res.status(200).send(user);
        });
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
	User.find({}, function (err, users) {
		if (err) return res.status(500).send("There was a problem finding the users.");
		res.status(200).send(users);
	});
});

//// UPDATES A SINGLE DRIVER IN THE DATABASE -- SO THAT USER CAN UPDATE HIMSELF AVAILABLE
router.put('/:id', function (req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		res.status(200).send(user);
	});
});

//// DELETES A USER FROM THE DATABASE -- ADMINS MAY HAVE ABILITY TO DELETE USERS
router.delete('/:id', function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User deleted.");
	});
});

