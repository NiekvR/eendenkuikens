var users = require('../../app/controllers/users.server.controller'),
    season = require('../../app/controllers/season.server.controller');

module.exports = function (app) {
    app.route('/api/season')
        .get(season.getSeason)
        .post(season.updateSeason);
}