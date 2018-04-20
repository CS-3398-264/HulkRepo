<<<<<<< HEAD
// User.js -- You’re creating a schema which 
// will give every user in the database a specific look.
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	name: String,
	needPickup: Boolean,
	longitude: Number,
	latitude: Number,
	rating: {type: Number, default : 0 },
	ratingList: [{ type: Number }]
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
=======
// User.js -- You’re creating a schema which 
// will give every user in the database a specific look.
var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
	name: String,
	needPickup: Boolean,
	longitude: Number,
	latitude: Number,
	driverLat: Number,
	driverLon: Number,
	driverID: String,
	rating: Number
});
mongoose.model('User', UserSchema);
module.exports = mongoose.model('User');
>>>>>>> a2576625d7428d8a406c34c305cf9f110bc22676
