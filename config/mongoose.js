'use strict';

var config = require('./config'),
    mongoose = require('mongoose');

module.exports = function() {
    var db = mongoose.connect(config.db);

    require('../app/models/user.server.model');
    require('../app/models/sighting.server.model');
    require('../app/models/photo.server.model');
    require('../app/models/season.server.model');
    require('../app/models/species.server.model');
    console.log("Con 1 "+ mongoose.connection.host);
    console.log("Con 1 "+ mongoose.connection.port);
    /*console.log("OpenshiftDetails: "+ process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
    process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
    process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
    process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
    process.env.OPENSHIFT_APP_NAME);*/

    return db;
};
