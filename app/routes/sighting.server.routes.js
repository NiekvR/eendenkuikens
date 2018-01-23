var users = require('../../app/controllers/users.server.controller'),
    season = require('../../app/controllers/season.server.controller'),
    sighting = require('../../app/controllers/sighting.server.controller'),
    multipart = require('connect-multiparty'),
    cors = require('cors'),
    multipartMiddleware = multipart();

module.exports = function(app) {
    app.route('/api/csv')
        .get(users.requiresLogin, sighting.csv);

    app.route('/api/writezip')
        .get(users.requiresLogin, sighting.writeZip);

    app.route('/api/deletefotos')
        .get(users.requiresLogin, sighting.deletefotos);

    app.route('/api/sighting')
        .get(users.requiresLogin, sighting.list)

    app.route('/api/sighting/:sightingId')
        .get(users.requiresLogin, sighting.read)
        //.put(users.requiresLogin, sighting.update)
        .delete(users.requiresLogin, sighting.delete);

    app.route('/zipdownload').get(sighting.writeZip);

    app.param('sightingId', sighting.sightingByID);

    app.use(cors());

    app.route('/api/sighting')
        .post(season.inSeason, multipartMiddleware, sighting.create);
};