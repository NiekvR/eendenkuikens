var users = require('../../app/controllers/users.server.controller'),
    species = require('../../app/controllers/species.server.controller'),
    multipart = require('connect-multiparty'),
    cors = require('cors'),
    multipartMiddleware = multipart();
module.exports = function (app) {
    app.route('/api/species')
        .post(users.requiresLogin, species.createSpecies);


    app.route('/api/species/:id')
        .post(users.requiresLogin, species.updateSpecies)
        .delete(users.requiresLogin, species.deleteSpecies);

    app.use(cors());

    app.route('/api/species')
        .get(species.listSpecies)
}