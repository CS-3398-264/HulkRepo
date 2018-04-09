// adminController.js
// This is the bare layout of the admin controller

// Express router used to create a subset of routes 
// which can be modular and independent from the whole app
var express = require('express');
var router = express.Router();

// Body parser is middleware to handle data in an elegant way.
// This'll be handy when sending data through HTTP requests using forms
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Admin = require('./Admin');
module.exports = router;

// CREATES A NEW ADMIN
/**first param: route which will be linked to a function. 
*  Second param: function. 1st param request to server. 2nd response from server
*/
router.post('/', function (req, res) {
	Admin.create({
		name: req.body.name
	},
        function (err, admin) {
        	if (err) return res.status(500).send("There was a problem adding the information to the database.");
        	res.status(200).send(admin);
        });
});
// RETURNS ALL THE ADMINS IN THE DATABASE
router.get('/', function (req, res) {
	Admin.find({}, function (err, admins) {
		if (err) return res.status(500).send("There was a problem finding the admins.");
		res.status(200).send(admins);
	});
});

// GETS A SINGLE ADMIN FROM THE DATABASE
router.get('/:id', function (req, res) {
	Admin.findById(req.params.id, function (err, admin) {
		if (err) return res.status(500).send("There was a problem finding the admin.");
		if (!admin) return res.status(404).send("No admin found.");
		res.status(200).send(admin);
	});
});

// DELETES A ADMIN FROM THE DATABASE
router.delete('/:id', function (req, res) {
	Admin.findByIdAndRemove(req.params.id, function (err, admin) {
		if (err) return res.status(500).send("There was a problem deleting the admin.");
		res.status(200).send("Admin: " + admin.name + " was deleted.");
	});
});

// UPDATES A SINGLE ADMIN IN THE DATABASE
router.put('/:id', function (req, res) {
	Admin.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, admin) {
		if (err) return res.status(500).send("There was a problem updating the admin.");
		res.status(200).send(admin);
	});
});
