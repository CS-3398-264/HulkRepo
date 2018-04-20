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

var auth = require('basic-auth');

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
		latitude: req.body.latitude
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

//// UPDATES A SINGLE USER IN THE DATABASE -- SO THAT USER CAN UPDATE HIMSELF AVAILABLE
router.put('/:id', function (req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		res.status(200).send(user);
	});
});

/*
router.post('/:id/ratingList', function (req, res) {
    var credentials = auth(req);
    if (!credentials || credentials.name !== 'driver' || credentials.pass !== 'vroom')
    {
        res.statusCode = 401;
        res.setHeader('WWW-Authenticate', 'Basic realm="example"');
        res.end('Access denied');
    }
    else
    {
    	User.findByIdAndUpdate(req.params.id,
			req.body.ratingList,
			function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                res.status(200).send(user);
			});

		});
    	/*
        User.findByIdAndUpdate({
                name: req.body.name,
                available: req.body.available,
                latitude: req.body.latitude,
                longitude: req.body.longitude
            },
            function (err, driver) {
                if (err) return res.status(500).send("There was a problem adding the information to the database.");
                res.status(200).send("Access Granted. " + driver.name + " created.\n\n" + driver);

            });

    }
});
*/

router.post('/:id', function(req, res) {

	var newRating = req.body.rating;

    User.update(
        { id: req.params.id },
        { $push: { ratingsList: newRating } },
		function(err) {
            if (err) {
                return res.status(500).send("Could not add rating to rating list");
            }
        }
    );

    User.update(
        { id: req.params.id },
        { $set: { rating: getAverage(req.id) } }
    );

	res.status(200).send("Rating added to the list");
});

//// DELETES A USER FROM THE DATABASE -- ADMINS MAY HAVE ABILITY TO DELETE USERS
router.delete('/:id', function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User deleted.");
	});
});



function getAverage(id){
    User.aggregate([ { $match: { _id:id }}, { $unwind: "$ratingList" },
        { $group: { _id: "$_id", average: { $avg: "$ratingList" } } } ], function (err,result)                  {
        if (err) {
            console.log(err);
        }
        console.log(result.average);
        return result.average;
    });
}