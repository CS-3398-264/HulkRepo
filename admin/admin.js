// User.js -- You’re creating a schema which 
// will give every user in the database a specific look.
var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({
	name: String
});
mongoose.model('Admin', AdminSchema);
module.exports = mongoose.model('Admin');
