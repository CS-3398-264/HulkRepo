// User.js -- You’re creating a schema which 
// will give every user in the database a specific look.
var mongoose = require('mongoose');
var DriverSchema = new mongoose.Schema({
	name: String,
	available: Boolean

});
mongoose.model('Driver', DriverSchema);
module.exports = mongoose.model('Driver');

