// User.js -- You’re creating a schema which 
// will give every user in the database a specific look.
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	name: String,
	email: String,
	password: String
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');

var NuberDriverSchema = new mongoose.Schema({
	name: String,
	xCoordinate: int,
	yCoordinate: int,
	rating: Int16Array
});

var NuberCustomerSchema = new mongoose.Schema({
	name: String,
	xCoordinate: float,
	yCoordinate: float,
	active: Boolean
});
