var mongoose = require('mongoose');
var DriverSchema = new mongoose.Schema({
	name: String,
	available: Boolean,
	latitude: Number,
	longitude: Number
});
mongoose.model('Driver', DriverSchema);
module.exports = mongoose.model('Driver');
