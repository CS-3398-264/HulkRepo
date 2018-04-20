var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Driver = require('./Driver');
<<<<<<< HEAD

var auth = require("basic-auth");
=======
var auth = require('basic-auth');
var distance = require('google-distance');
>>>>>>> a2576625d7428d8a406c34c305cf9f110bc22676

module.exports = router;

// CREATES A NEW DRIVER -- ONLY AVAILABLE TO ADMIN IF HE KNOWS THE CREDENTIALS
/**first param: route which will be linked to a function. 
*  Second param: function. 1st param request to server. 2nd response from server
*/
router.post('/', function (req, res) {
	var credentials = auth(req);
	if (!credentials || credentials.name !== 'admin' || credentials.pass !== 'secret') {
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="example"');
		res.end('Access denied');
	} else {
		
		Driver.create({
			name: req.body.name,
			available: req.body.available,
			latitude: req.body.latitude,
			longitude: req.body.longitude,
			userLat: req.body.userLat,
			userLon: req.body.userLon,
			vehicleSize: req.body.vehicleSize
		},
	function (err, driver) {
		if (err) return res.status(500).send("There was a problem adding the information to the database.");
		res.status(200).send("Access Granted. " + driver.name + " created.\n\n" + driver);

	});
	}
});

// GETS ALL DRIVERS FROM THE DATABASE, OR BY QUERY PARAMETERS
router.get('/', function (req, res) {
	if (req.query.name)
	{
		Driver.find({
			name: req.query.name
		}, function (err, drivers) {
			if (err) return res.status(500).send("There was a problem finding the driver(s).");
			res.status(200).send(drivers);
		});
	}
	else if (req.query.available)
	{		
		Driver.find({
			available: req.query.available
		}, function (err, drivers) {
			if (err) return res.status(500).send("There was a problem finding the driver(s).");
			res.status(200).send(drivers);
		});
	}
	else if (req.query.vehicleSize) {
		Driver.find({
			vehicleSize: req.query.vehicleSize
		}, function (err, drivers) {
			if (err) return res.status(500).send("There was a problem finding the driver(s).");
			res.status(200).send(drivers);
		});
	}
	else if (req.query.name && req.query.available)
	{
		Driver.find({
			name: req.query.name,
			available: req.query.available
		}, function (err, drivers) {
			if (err) return res.status(500).send("There was a problem finding the driver(s).");
			res.status(200).send(drivers);
		});
	}
	else
	{
		Driver.find({}, function (err, drivers) {
			if (err) return res.status(500).send("There was a problem finding the driver(s).");
			res.status(200).send(drivers);
		});
	}
});
//// GETS A SINGLE DRIVER IN THE DATABASE
router.get('/:id', function (req, res) {
	Driver.findById(req.params.id, function (err, driver) {
		if (err) return res.status(500).send("There was a problem finding the driver.");
		if (!driver) return res.status(404).send("No driver found.");

		distance.get({
			origin: [driver.userLat + ", " + driver.userLon],
			destination: [driver.latitude + ", " + driver.longitude],
			mode: 'driving',
			units: 'imperial'
		},
		function (err, data) {
			if (err) return console.log(err);
			if (!data) return console.log('no distance');
			console.log("Distance to user: " + data.distance + "\nArrival Time: " + data.duration + "\n");
			dis = data.distance;
			dur = data.duration;
			res.status(200).send("Distance to user: " + data.distance + "\nArrival Time: " + data.duration + "\n\n" + driver);
		});
		
	});
});

//// UPDATES A SINGLE DRIVER IN THE DATABASE -- SO THAT DRIVER CAN UPDATE HIMSELF AVAILABLE
router.put('/:id', function (req, res) {
	Driver.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, driver) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		
		distance.get({
			origin: [driver.userLat + ", " + driver.userLon],
			destination: [driver.latitude + ", " + driver.longitude],
			mode: 'driving',
			units: 'imperial'
		},
		function (err, data) {
			if (err) return console.log(err);
			if (!data) return console.log('no distance');
			res.status(200).send("Distance to user: " + data.distance + "\nArrival Time: " + data.duration + "\n\n" + driver);
			console.log("Distance to user: " + data.distance + "\nArrival Time: " + data.duration + "\n");
		});
	});
});


//// DELETES A DRIVER FROM THE DATABASE  -- ONLY AVAILABLE TO ADMIN IF HE KNOWS THE CREDENTIALS
router.delete('/:id', function (req, res) {
	var credentials = auth(req);
	if (!credentials || credentials.name !== 'admin' || credentials.pass !== 'secret')
	{
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="example"');
		res.end('Access denied');
	}
	else
	{

		Driver.findByIdAndRemove(req.params.id, function (err, driver) {
			if (err) return res.status(500).send("There was a problem deleting the driver.");
			res.status(200).send("Access Granted. Driver deleted.");
		});
	}
});

