var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

var Driver = require('./Driver');
module.exports = router;

// CREATES A NEW DRIVER -- SOME OF THESE FUNCTIONS, IF UI WAS PRESENT
// SHOULD ONLY BE AUTHORIZED BY AN ADMIN
/**first param: route which will be linked to a function. 
*  Second param: function. 1st param request to server. 2nd response from server
*/
router.post('/', function (req, res) {
	Driver.create({
		name: req.body.name,
		available: req.body.available,
		latitude: req.body.latitude,
		longitude: req.body.longitude
	},
        function (err, driver) {
        	if (err) return res.status(500).send("There was a problem adding the information to the database.");
        	res.status(200).send(driver);
        });
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

//// DELETES A DRIVER FROM THE DATABASE
router.delete('/:id', function (req, res) {
	Driver.findByIdAndRemove(req.params.id, function (err, driver) {
		if (err) return res.status(500).send("There was a problem deleting the driver.");
		res.status(200).send("Driver deleted.");
	});
});


