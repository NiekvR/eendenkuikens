var mongoose = require('mongoose'),
    Sighting = mongoose.model('Sighting'),
    fs = require('fs-extra'),
    path = require('path'),
    json2csv = require('json2csv'),
    archiver = require('archiver'),
    mv = require('mv');

var getErrorMessage = function (err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Onbekende server error';
    }
};

exports.create = function (req, res) {
    var sighting = new Sighting(req.body.sighting);
    sighting.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        sighting.waarnemingId = 'EK-2018-' + sighting.waarnemingIdCount;
        sighting.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }
        });
        console.log('waarnemingId: ' + sighting.waarnemingId);
        res.json(sighting);
    });
};

exports.list = function (req, res) {
    Sighting.find().limit(50).sort('-sigthingDate').exec(function (err, sightings) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(sightings);
        }
    });
};

var fields = ['sigthingDate', 'waarnemingId', 'numberOfChicks', 'observerName', 'observerEmail', 'gezinEerderGemeld', 'gezinEerderGemeldWithId', 'habitat', 'remarks', 'lat', 'lng', 'age', 'permission'];
var fieldsQ = 'sigthingDate waarnemingId numberOfChicks observerName observerEmail gezinEerderGemeld gezinEerderGemeldWithId habitat remarks lat lng age permission';

exports.csv = function (req, res) {
    console.log("Starting CSV export");
    Sighting.find({}, fieldsQ, function (err, sightings) {
        if (err) {
            console.log(err)
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            console.log("JSON to CSV");
            json2csv({ data: sightings, fields: fields, del: ';' }, function (err, tsv) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.setHeader('content-type', 'text/csv');
                    res.setHeader('content-disposition', "attachment; filename='sightings.csv'");
                    res.set('Content-Type', 'application/octet-stream');
                    res.send(tsv);
                }
            });
        }
    });
};


exports.writeZip = function (req, res) {
    Sighting.find().skip(parseInt(req.query.skip)).limit(25).exec(function (err, sightings) {
        if (sightings.length > 0) {
            writeImages(sightings);
            writeZipFile(res);
        } else {
            return res.status(400).send({
                message: 'No sightings found after sighting id: ' + req.query.skip
            });
        }
    });
}

function writeImages(sightings) {
    console.log("Start writing images")
    if (!fs.existsSync(path.join(__dirname, '../../public/img/uploads/'))) {
        fs.mkdirSync(path.join(__dirname, '../../public/img/uploads/'));
    } else {
        fs.emptyDirSync(path.join(__dirname, '../../public/img/uploads/'));
    }

    sightings.forEach((sighting) => {
        if (sighting.photo) {
            console.log("Creating photo for observation: " + sighting.waarnemingId)
            let base64Image = sighting.photo.split(';base64,').pop();

            var uploadDate = new Date().toISOString();
            uploadDate = uploadDate.replace('.', '');
            uploadDate = uploadDate.replace(':', '');
            uploadDate = uploadDate.replace(':', '');
            var filename = uploadDate + '_EK-2018-' + sighting.waarnemingIdCount;
            var targetPath = path.join(__dirname, '../../public/img/uploads/');
            var savePath = targetPath + filename + '.png';

            fs.writeFile(savePath, base64Image, { encoding: 'base64' }, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                }
            });
        } else {
            console.log("No photo for observation: " + sighting.waarnemingId)
        }
        console.log("END writing images")
    });
}

function writeZipFile(res) {
    console.log("Start writing Zip-file")
    var basedir = 'public/img/',
        dir = basedir + 'uploads/',
        zipName = 'jsd-photos.zip',
        downloaddir = 'img/' + zipName,
        fileArray = getDirectoryList(dir),
        output = fs.createWriteStream(basedir + zipName),
        archive = archiver('zip');

    if (fileArray.length > 0) {
        archive.on('error', function (err) {
            console.error(err);
            res.status(500).send({ error: err.message });
        });

        output.on('close', function () {
            return res.status(200).send(downloaddir).end();
        });

        res.attachment('myzip.zip');

        archive.pipe(output);

        fileArray.forEach(function (item) {
            if (item.name !== '.DS_Store') {
                var file = item.path + item.name;
                archive.append(fs.createReadStream(file), { name: item.name });
            }
        });

        archive.finalize();
    } else {
        res.status(400).send({ message: 'No images in sighting selection' });
    }
    console.log("End writing Zip-file")
};

exports.deletefotos = function (req, res) {

    Sighting.find().skip(parseInt(req.query.skip)).limit(25).exec(function (err, sightings) {
        if (sightings.length > 0) {
            sightings.forEach((sighting) => {
                if (sighting.photo) {
                    sighting.photo = null;
                    sighting.save(function (err) {
                        if (err) {
                            console.log(err);
                            return res.status(400).send({
                                message: getErrorMessage(err)
                            });
                        }
                    });
                }
            });
        } else {
            return res.status(400).send({
                message: 'No sightings found after sighting id: ' + req.query.skip
            });
        }
    });

    res.status(200).send('OK').end();
};

function deleteDirectoryContent(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function (file) {
        fs.unlink(dir + file, function (err) {
            if (err) {
                console.log("Error: " + err);
                throw err
            }
        });
    });
    console.log("Deleting fotos completed");
    return { status: 200, message: 'OK' };
}

function getDirectoryList(dir) {
    var fileArray = [],
        files = fs.readdirSync(dir);
    files.forEach(function (file) {
        var obj = { name: file, path: dir };
        fileArray.push(obj);
    });
    return fileArray;
};

exports.sightingByID = function (req, res, next, id) {
    Sighting.findById(id).exec(function (err, sighting) {
        if (err) return next(err);
        if (!sighting) return next(new Error('Het is niet gelukt de volgende waarneming te laden: ' + id));

        req.sighting = sighting;
        next();
    });
};

exports.read = function (req, res) {
    res.json(req.sighting);
};

exports.delete = function (req, res) {
    var sighting = req.sighting;

    sighting.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(sighting);
        }
    });
};
