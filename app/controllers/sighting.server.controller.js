var mongoose = require('mongoose'),
    Sighting = mongoose.model('Sighting'),
    Photo = mongoose.model('Photo'),
    fs = require('fs-extra'),
    path = require('path'),
    json2csv = require('json2csv'),
    archiver = require('archiver'),
    mv = require('mv')
    async = require("async");

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
    console.log(req.body.sighting);
    var reqSighting = req.body.sighting;
    var photoBase64 = reqSighting.photo;
    reqSighting.photo = null;
    var sighting = new Sighting(reqSighting);
    sighting.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        sighting.waarnemingId = 'EK-2019-' + sighting.waarnemingIdCount;

        if(photoBase64) {
            var photo = new Photo({waarnemingId: sighting.waarnemingId, base64: photoBase64});
            photo.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                }
            });
            sighting.photo = photo.waarnemingId;
        }

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

exports.getPhoto = function (req, res) {
    Photo.findOne({waarnemingId: req.query.waarnemingId}).exec(function (err, photo) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(photo);
        }
    });
}

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
    async.waterfall([
        function(callback) {
            Sighting.count().exec(function(err, count) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(null, count);
                }
            });
        },
        function(count, callback) {
            async.timesLimit(count, 5, function (n, next) {
                Sighting.findOne().skip(n).exec(function(err, sighting) {
                    if(err) {
                        next(err);
                    }
                    next(null, sighting);
                });
            }, function (err, sightings) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                callback(null, sightings);
            });
        }
    ], function (err, result) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else if (result) {
            console.log('result', result.length);
            json2csv({ data: result, fields: fields, del: ';' }, function (err, csv) {
                if (err) {
                    return res.status(400).send({
                        message: getErrorMessage(err)
                    });
                } else {
                    res.setHeader('content-disposition', 'attachment; filename=sightings.csv');
                    res.set('content-type', 'text/csv');
                    console.log(res);
                    return res.status(200).send(csv).end();
                }
            });
        }
    });
};


exports.writeZip = function (req, res) {
    writeImages(res);
}

function writeImages(res) {
    console.log("Start writing images")
    if (!fs.existsSync(path.join(__dirname, '../../public/img/uploads/'))) {
        fs.mkdirSync(path.join(__dirname, '../../public/img/uploads/'));
    } else {
        fs.emptyDirSync(path.join(__dirname, '../../public/img/uploads/'));
    }

    async.waterfall([
        function(callback) {
            Photo.count().exec(function(err, count) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(null, count);
                }
            });
        },
        function(count, callback) {
            async.timesLimit(count, 5, function (n, next) {
                writeImage(n, function (err, waarnemingId) {
                    next(err, waarnemingId);
                });
            }, function (err, waarnemingIds) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                callback(null, waarnemingIds);
            });
        }
    ], function (err, result) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else if (result) {
            console.log('count', result);
            writeZipFile(res);
        }
    });
}

function writeImage(skip, callback) {
    Photo.findOne().skip(skip).exec(function (err, photo) {
        console.log("Creating photo for observation: " + photo.waarnemingId)
        let base64Image = photo.base64.split(';base64,').pop();

        var uploadDate = new Date().toISOString();
        uploadDate = uploadDate.replace('.', '');
        uploadDate = uploadDate.replace(':', '');
        uploadDate = uploadDate.replace(':', '');
        var filename = uploadDate + '_EK-2019-' + photo.waarnemingId;
        var targetPath = path.join(__dirname, '../../public/img/uploads/');
        var savePath = targetPath + filename + '.png';

        fs.writeFile(savePath, base64Image, { encoding: 'base64' }, function (err) {
            if (err) {
                console.log(err);
                callback(err);
            } else {
                callback(null, photo.waarnemingId);
            }
        });
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
    async.waterfall([
        function(callback) {
            deleteImage(function(err) {
                if(err) {
                    callback(err);
                }
                callback(null);
            });
        },
        function(callback) {
            removeImageReferences(function(err) {
                if(err) {
                    callback(err);
                }
                callback(null);
            })
        }
    ], function (err, result) {
        if(err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        return res.status('200').send();
    });
};

function deleteImage(callback) {
    Photo.remove({}, function(err) {
        if(err) {
            callback(err);
        }
        callback(null);
    });
}

function removeImageReferences(callback) {
    async.waterfall([
        function(callback) {
            Sighting.count().exec(function(err, count) {
                if (err) {
                    console.log(err);
                    callback(err);
                } else {
                    callback(null, count);
                }
            });
        },
        function(count, callback) {
            async.timesLimit(count, 5, function (n, next) {
                removeImageReference(n, function (err, waarnemingId) {
                    next(err, waarnemingId);
                });
            }, function (err) {
                if (err) {
                    console.log(err);
                    callback(err);
                }
                callback(null);
            });
        }
    ], function (err, result) {
        if(err) {
            callback(err);
        }
        callback(null);
    });
}

function removeImageReference(skip, callback) {
    Sighting.findOne().skip(skip).exec(function(err, sighting) {
        var waarnemingId = sighting.waarnemingId;
        console.log('skip', skip);
        console.log('waarnemingId', waarnemingId);
        if(sighting.photo) {
            sighting.photo = null;
            sighting.save(function (err) {
                if(err) {
                    callback(err);
                }
                console.log('Updating sighting: ' + waarnemingId);
                callback(null, waarnemingId);
            });
        } else {
            callback(null);
        };
    });
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

exports.mock = function (req, res) {
    async.times(50, function (n, next) {
        handleMockSighting(function (err, user) {
            next(err, user);
        });
    }, function (err, users) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        console.log(users)
        res.status(200).send();
    });
}

var handleMockSighting = function (callback) {
    var sighting = new Sighting(createMockSighting());
    sighting.save(function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        sighting.waarnemingId = 'EK-2019-' + sighting.waarnemingIdCount;

        var photo = new Photo({waarnemingId: sighting.waarnemingId, base64: ("data:image/png;base64," + base64_encode('public/img/IMG_4496.JPG'))});
        photo.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }
        });
        sighting.photo = photo.waarnemingId;

        sighting.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            }
        });
        callback(null, {
            id: sighting.waarnemingId
        });
    });
}

function createMockSighting() {
    return {
        "sigthingDate": "2019-05-01T00:00:00.000Z",
        "numberOfChicks": 2,
        "permission": true,
        "lat": "52.11999865763816",
        "lng": "4.76806640625",
        "age": "2"
    }
}

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}