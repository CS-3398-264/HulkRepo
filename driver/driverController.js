var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Driver = require('./Driver');
var auth = require('basic-auth');
var distance = require('google-distance');
var map = require('google_directions');

require('console-png').attachTo(console); // for the icon

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
			userID: req.body.userID,
			vehicleSize: req.body.vehicleSize,
			logo: req.body.logo,
			rating: 0,
			numRatings: 0
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

		// Display the logo
		var image = require('fs').readFileSync(__dirname + '/' + driver.logo +'.png');
		console.png(image);
		console.log("Number of ratings: " + driver.numRatings + "\nRating: " + driver.rating + "\n");

		distance.get({
			origin: [driver.userLat + ", " + driver.userLon],
			destination: [driver.latitude + ", " + driver.longitude],
			mode: 'driving',
			units: 'imperial'
		},
		function (err, data) {
			if (err) return console.log(err);
			if (!data) return console.log('no distance');
			console.log("\nArrival Time: " + data.duration + "\n");
			
			res.status(200).send("\nArrival Time: " + data.duration + "\n\n" + driver);
		});
	});
});

//// GETS DRIVER IN THE RADIUS
router.get('/directions/:id', function (req, res) {
	Driver.findById(req.params.id, function (err, driver) {
		if (err) return res.status(500).send("There was a problem finding the driver.");
		if (!driver) return res.status(404).send("No driver found.");

		var params = {
			// REQUIRED ,
			origin: [driver.latitude + ", " + driver.longitude],
			destination: [driver.userLat + ", " + driver.userLon],
			key: "AIzaSyDbcwRS0g5wUo1lxrkUBxIJBLLZzRDRlJE",

			// OPTIONAL 
			mode: "driving",
			avoid: "",
			language: "",
			units: "imperial",
			region: "",
		};

		// get navigation steps as JSON object 
		map.getDirectionSteps(params, function (err, steps) {
			if (err) {
				console.log(err);
				return 1;
			}
			// parse the JSON object of steps into a string output 
			var output = "";
			var stepCounter = 1;
			steps.forEach(function (stepObj) {
				var instruction = stepObj.html_instructions;
				instruction = instruction.replace(/<[^>]*>/g, ""); // regex to remove html tags 
				var distance = stepObj.distance.text;
				var duration = stepObj.duration.text;
				output += "Step " + stepCounter + ": " + instruction + " (" + distance + ")\n";
				stepCounter++;
			});

			var totalT = "";
			// From here we just want to get the arrival time
			distance.get({
				origin: [driver.userLat + ", " + driver.userLon],
				destination: [driver.latitude + ", " + driver.longitude],
				mode: 'driving',
				units: 'imperial'
			},
			function (err, data) {
				if (err) return console.log(err);
				if (!data) return console.log('no distance');
				console.log("\nArrival Time: " + data.duration + "\n-----\n");
				totalT += data.duration;
				res.status(200).send(driver + "\n\n" + output + "\nArrival Time: " + totalT);
				//res.status(200).send("Distance to user: " + data.distance + "\nArrival Time: " + data.duration + "\n\n" + driver);
			});

			console.log("\n" + output);
			

		});
	});
});



//// UPDATES A SINGLE DRIVER IN THE DATABASE -- SO THAT DRIVER CAN UPDATE HIMSELF AVAILABLE
// Directions are outputted with the PUT call so that as it's driving and updating it's lat/lon, it'll show the current directions.
router.put('/:id', function (req, res) {
	Driver.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, driver) {
		if (err) return res.status(500).send("There was a problem updating the user.");
		
		var params = {
			// REQUIRED 
			origin: [driver.latitude + ", " + driver.longitude],
			destination: [driver.userLat + ", " + driver.userLon],
			key: "AIzaSyDbcwRS0g5wUo1lxrkUBxIJBLLZzRDRlJE",

			// OPTIONAL 
			mode: "driving",
			avoid: "",
			language: "",
			units: "imperial",
			region: "",
		};

		// get navigation steps as JSON object 
		map.getDirectionSteps(params, function (err, steps) {
			if (err) {
				console.log(err);
				return 1;
			}

			// parse the JSON object of steps into a string output 
			var output = "";
			var stepCounter = 1;
			steps.forEach(function (stepObj) {
				var instruction = stepObj.html_instructions;
				instruction = instruction.replace(/<[^>]*>/g, ""); // regex to remove html tags 
				var distance = stepObj.distance.text;
				var duration = stepObj.duration.text;
				output += "Step " + stepCounter + ": " + instruction + " (" + distance + ")\n";
				stepCounter++;
			});

			var totalT = "";
			// From here we just want to get the arrival time
			distance.get({
				origin: [driver.userLat + ", " + driver.userLon],
				destination: [driver.latitude + ", " + driver.longitude],
				mode: 'driving',
				units: 'imperial'
			},
			function (err, data) {
				if (err) return console.log(err);
				if (!data) return console.log('no distance');
				console.log("\nArrival Time: " + data.duration + "\n-----\n");
				totalT += data.duration;
				res.status(200).send(driver + "\n\n" + output + "\nArrival Time: " + totalT);
				//res.status(200).send("Distance to user: " + data.distance + "\nArrival Time: " + data.duration + "\n\n" + driver);
			});

			console.log("\n" + output);

		});
	});
});

//// UPDATES A SINGLE USER IN THE DATABASE -- SO THAT USER CAN UPDATE HIMSELF AVAILABLE -- LETS KEEP IT AT 1 - 5
router.put('/rating/:id', function (req, res) {
	Driver.findById(req.params.id, function (err, driver) {
		if (err) return res.status(500).send("There was a problem finding the driver.");
		if (!driver) return res.status(404).send("No driver found.");

		var newRating = 0;
		newRating = ((driver.rating * (driver.numRatings)) + parseInt(req.body.rating)) / (driver.numRatings + 1);
		console.log("Rating: " + newRating);

		driver.rating = newRating.toFixed(2);
		driver.numRatings++;

		Driver.findByIdAndUpdate(req.params.id, driver, { new: true }, function (err, oldDriver) {
			
			if (err) return res.status(500).send("There was a problem updating the user.");
			res.status(200).send(driver);
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

