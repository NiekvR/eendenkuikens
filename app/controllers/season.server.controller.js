var mongoose = require('mongoose'),
    Season = mongoose.model('Season');

var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Onbekende server error';
    }
};

exports.inSeason = function (req, res, next) {
    Season.find().limit(1).sort('-date').exec(function (err, season) {
        if (err) {
            return res.status(404).send({
                message: getErrorMessage(err)
            });
        } else {
            console.log(season);
            if (season[0].inSeason) {
                next()
            } else {
                return res.status(405).send({
                    message: 'No duck season'
                });
            }
        }
    });
}

exports.getSeason = function (req, res) {
    Season.find().limit(1).sort('-date').exec(function (err, season) {
        if (err) {
            return res.status(404).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(season);
        }
    });
}

exports.updateSeason = function (req, res) {
    console.log(req.body.inSeason);
    if (req.body.inSeason !== undefined) {
        var season = new Season({ inSeason: req.body.inSeason, date: new Date() });
        season.save(function (err) {
            if (err) {
                var message = getErrorMessage(err);

                req.flash('error', message);
                return res.redirect('/signup');
            }
        });
        console.log(season);
        res.json(season);
    } else {
        var message = getErrorMessage('Request not valid');

        req.flash('error', message);
        return res.redirect('/signup');
    }
}