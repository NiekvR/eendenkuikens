var mongoose = require('mongoose'),
    Species = mongoose.model('Species');

var getErrorMessage = function (err) {
    console.log(err);
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Onbekende server error';
    }
};

exports.createSpecies = function (req, res) {
    console.log(req.body);
    if (req.body.species !== undefined) {
        var species = new Species(req.body.species);
        species.save(function (err) {
            if (err) {
                console.log(err);
                req.flash('error', message);
                return res.status(400).send({ message: getErrorMessage(err) });
            }
            console.log(species);
            return res.json(species);
        });
    } else {
        var message = getErrorMessage('Request not valid');

        req.flash('error', message);
        return res.redirect('/signup');
    }
}

exports.listSpecies = function (req, res) {
    Species.find().exec(function (err, species) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(species);
        }
    });
}

exports.updateSpecies = function (req, res) {
    console.log('species', req.body.species);
    if (req.body.species !== undefined) {
        console.log('req', req.params);
        Species.findOneAndUpdate(
            { _id: req.body.species._id },
            {
                'nameNL': req.body.species.nameNL,
                'nameEN': req.body.species.nameEN,
                'speciesLatin': req.body.species.speciesLatin,
                'familyLatin': req.body.species.familyLatin,
                'inUse': req.body.species.inUse,
            },
            { upsert: false },
            function (err, species) {
                if (err) {
                    var message = getErrorMessage(err);

                    return res.status(500).send({
                        message: message
                    });
                } else {
                    res.json(species);
                }
            }
        );
    } else {
        var message = getErrorMessage('Request not valid');

        return res.status(500).send({
            message: message
        });
    }
}

exports.deleteSpecies = function (req, res) {
    console.log(req.params.id);
    Species.findById(req.params.id).remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json('ok');
        }
    });
};

