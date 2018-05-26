'use strict';

var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    flash = require('connect-flash'),
    passport = require('passport'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

module.exports = function () {
    var app = express();

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
    }

    app.use(bodyParser.urlencoded({
        limit: '50mb',
        extended: true
    }));
    app.use(bodyParser.json({limit: '50mb'}));
    app.use(methodOverride());

    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());

    app.use(multipartMiddleware);

    require('../app/routes/index.server.routes.js')(app);
    require('../app/routes/users.server.routes.js')(app);
    require('../app/routes/sighting.server.routes.js')(app);
    require('../app/routes/season.server.routes.js')(app);
    require('../app/routes/species.server.routes.js')(app);

    app.use(express.static('./public'));

    return app;
};