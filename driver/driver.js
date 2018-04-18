var mongoose = require('mongoose');
var DriverSchema = new mongoose.Schema({
	name: String,
	available: Boolean,
	latitude: Number,
	longitude: Number,
	userLat: Number,
	userLon: Number,
	vehicleSize: String
});
mongoose.model('Driver', DriverSchema);
module.exports = mongoose.model('Driver');

