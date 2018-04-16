// server.js -- This is the actual app object we created in app.js
var app = require('./app');
var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
	console.log('Express server listening on port ' + port);
});