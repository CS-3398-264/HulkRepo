// app.js
var express = require('express');
var app = express();

var db = require('./db');

var UserController = require('./user/userController');
app.use('/users', UserController);

var AdminController = require('./admin/adminController');
app.use('/admins', AdminController);

var DriverController = require('./driver/driverController');
app.use('/drivers', DriverController);

module.exports = app;