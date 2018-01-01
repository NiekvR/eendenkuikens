'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var mongoose = require('./config/mongoose'),
    express = require('./config/express'),
    passports = require('./config/passport');

var db = mongoose();
var app = express();
var passport = passports();
var ip = process.env.IP || 'localhost';
var port = process.env.PORT || 3000;
app.listen(port, ip);
module.exports = app;

console.log('Server running at http://'+ip+':'+port);