var mongoose = require('mongoose');
var AdminSchema = new mongoose.Schema({
	name: String
});
// Model name is 'Admin'
mongoose.model('Admin', AdminSchema);
// Export for use in other parts of program
module.exports = mongoose.model('Admin');
