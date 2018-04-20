var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Driver = require('./Driver');

var auth = require("basic-auth");

module.exports = router;

// CREATES A NEW DRIVER -- ONLY AVAILABLE TO ADMIN IF HE KNOWS THE CREDENTIALS
/**first param: route which will be linked to a function. 
*  Second param: function. 1st param request to server. 2nd response from server
*/
router.post('/', function (req, res) {
	var credentials = auth(req);
	if (!credentials || credentials.name !== 'admin' || credentials.pass !== 'secret') 
	{
		res.statusCode = 401;
		res.setHeader('WWW-Authenticate', 'Basic realm="example"');
		res.end('Access denied');
	} 
	else 
	{
		Driver.create({
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

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', function (req, res) {
	Driver.findById(req.params.id, function (err, user) {
		if (err) return res.status(500).send("There was a problem finding the user.");
		if (!user) return res.status(404).send("No driver found.");
		res.status(200).send(user);
	});
});


// GETS ALL DRIVERS FROM THE DATABASE
router.get('/', function (req, res) {
	Driver.find({}, function (err, drivers) {
		if (err) return res.status(500).send("There was a problem finding the drivers.");
		res.status(200).send(drivers);
	});
});

//// UPDATES A SINGLE DRIVER IN THE DATABASE
router.get('/', function (req, res) {
	Driver.find({}, function (err, drivers) {
		if (err) return res.status(500).send("There was a problem finding the drivers.");
		res.status(200).send(drivers);
	});
});

//// UPDATES A SINGLE DRIVER IN THE DATABASE -- SO THAT DRIVER CAN UPDATE HIMSELF AVAILABLE
router.put('/:id', function (req, res) {
	Driver.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, driver) {
		if (err) return res.status(500).send("There was a problem updating the driver.");
		res.status(200).send(driver);
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
			res.status(200).send("Access Granted. " + driver.name + " deleted.");
		});
	}
});
