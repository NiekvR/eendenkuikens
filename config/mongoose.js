'use strict';

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    require('../app/models/user.server.model');
    require('../app/models/sighting.server.model');
    console.log("Con 1 "+ mongoose.connection.host);
    console.log("Con 1 "+ mongoose.connection.port);

    return db;
};