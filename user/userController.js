<<<<<<< HEAD
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
=======
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

//var distance = require('google-distance-matrix');
var distance = require('google-distance');

/*var origins = ['29.887487, -97.940158'];
var destinations = ['29.892996, -97.902081', ];

distance.key('AIzaSyDbcwRS0g5wUo1lxrkUBxIJBLLZzRDRlJE');
distance.units('imperial');

distance.matrix(origins, destinations, function (err, distances) {
	if (err) {
		return console.log(err);
	}
	if (!distances) {
		return console.log('no distances');
	}
	if (distances.status == 'OK') {
		for (var i = 0; i < origins.length; i++) {
			for (var j = 0; j < destinations.length; j++) {
				var origin = distances.origin_addresses[i];
				var destination = distances.destination_addresses[j];
				if (distances.rows[0].elements[j].status == 'OK') {
					var distance = distances.rows[i].elements[j].distance.text;
					console.log('Distance from ' + origin + ' to ' + destination + ' is ' + distance);
				} else {
					console.log(destination + ' is not reachable by land from ' + origin + '\n\n');
				}
			}
		}
	}
});*/


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

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
	User.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem finding the user.");
		if (!user) return res.status(404).send("No user found.");
		distance.get({
			origin: [user.driverLat + ", " + user.driverLon],
			destination: [user.latitude + ", " + user.longitude],
			mode: 'driving',
			units: 'imperial'
		},
			  function (err, data) {
			  	if (err) return console.log(err);
			  	if (!data) return consoloe.log('no distance');
			  	console.log("Distance from Driver: " + data.distance + "\nArrival Time: " + data.duration + "\n");
			  	res.status(200).send("Distance from Driver: " + data.distance + "\nArrival Time: " + data.duration + "\n\n" + user );
			  });
		
	});
});

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', function (req, res) {
	if (req.query.name) {
		User.find({
			name: req.query.name
		}, function (err, user) {
			if (err) return res.status(500).send("There was a problem finding the user.");
			res.status(200).send(user);
		});
	}
	else if (req.query.needPickup) {
		User.find({
			needPickup: req.query.needPickup
		}, function (err, user) {
			if (err) return res.status(500).send("There was a problem finding the user.");
			res.status(200).send(user);
		});
	}
	else if (req.query.name && req.query.needPickup) {
		User.find({
			name: req.query.name,
			needPickup: req.query.needPickup
		}, function (err, user) {
			if (err) return res.status(500).send("There was a problem finding the user.");
			res.status(200).send(user);
		});
	}
	else if (req.query.rating) {
		User.find({
			name: req.query.rating
		}, function (err, user) {
			if (err) return res.status(500).send("There was a problem finding the user.");
			res.status(200).send(user);
		});
	}
	else {
		User.find({}, function (err, users) {
			if (err) return res.status(500).send("There was a problem finding the user.");
			res.status(200).send(users);
		});
	}
});

//// UPDATES A SINGLE USER IN THE DATABASE -- SO THAT USER CAN UPDATE HIMSELF AVAILABLE
router.put('/:id', function (req, res) {
	User.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, user) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		
		distance.get({
			origin: [user.driverLat + ", " + user.driverLon],
			destination: [user.latitude + ", " + user.longitude],
			mode: 'driving',
			units: 'imperial'
		},
		function (err, data) {
			if (err) return console.log(err);
			if (!data) return console.log('no distance');
			res.status(200).send("Distance from Driver: " + data.distance + "\nArrival Time: " + data.duration + "\n" + user);
			console.log("Distance from Driver: " + data.distance + "\nArrival Time: " + data.duration + "\n");
		});
	});
});

//// DELETES A USER FROM THE DATABASE -- ADMINS MAY HAVE ABILITY TO DELETE USERS
router.delete('/:id', function (req, res) {
	User.findByIdAndRemove(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem deleting the user.");
		res.status(200).send("User deleted.");
	});
});
>>>>>>> a2576625d7428d8a406c34c305cf9f110bc22676
