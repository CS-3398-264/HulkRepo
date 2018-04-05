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

// CREATES A NEW USER

/**first param: route which will be linked to a function. 
*  Second param: function. 1st param request to server. 2nd response from server
*/
router.post('/', function (req, res) {
	User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password
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

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
	User.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem finding the user.");
		if (!user) return res.status(404).send("No user found.");
		res.status(200).send(user);
	});
});

// DELETES A USER FROM THE DATABASE
router.delete('/:id', function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User: " + user.name + " was deleted.");
	});
});

// UPDATES A SINGLE USER IN THE DATABASE
router.put('/:id', function (req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		res.status(200).send(user);
	});
});