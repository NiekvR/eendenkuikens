var mongoose = require('mongoose'),
    Sighting = mongoose.model('Sighting'),
    fs = require('fs-extra'),
    path = require('path'),
    json2csv = require('json2csv'),
    archiver = require('archiver'),
    mv = require('mv');

var getErrorMessage = function(err) {
    if (err.errors) {
        for (var errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].message;
        }
    } else {
        return 'Onbekende server error';
    }
};

exports.create = function(req, res) {
    console.log(req.body);
    console.log(req.files.file);
    var sighting = new Sighting(req.body.sighting);
    console.log('log: '+ sighting.waarnemingId);
    sighting.save(function(err) {
        if (err) {
            console.log(err);
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            if(req.files.file){   // If the Image exists
                var file = req.files.file;
                var uploadDate = new Date().toISOString();
                uploadDate = uploadDate.replace('.','');
                uploadDate = uploadDate.replace(':','');
                uploadDate = uploadDate.replace(':','');
                var tempPath = file.path;

                var targetPath = path.join(__dirname,'../../public/img/uploads/' + uploadDate + file.originalFilename);
                var savePath = 'img/uploads/' + uploadDate + file.originalFilename;

                mv(tempPath, targetPath, function(err) {
                    if(err) {
                        console.log(err);
                        throw err
                    } else {
                        sighting.photo = savePath;
                        sighting.save(function(err) {
                            if(err) {
                                return res.status(400).send({
                                    message: getErrorMessage(err)
                                });
                            } else {
                                console.log('Upload complete for file: ' + file.originalFilename);
                            }
                        })
                    }
                });
            }
        }
        console.log('Upload complete for observation: ' + sighting._id);
        console.log('waarnemingId: ' + sighting.waarnemingIdCount);
        sighting.waarnemingId = 'EK' + sighting.waarnemingIdCount;
        sighting.save(function(err) {
                        if(err) {
                            return res.status(400).send({
                                message: getErrorMessage(err)
                            });
                        }
                    });
        console.log('waarnemingId: ' + sighting.waarnemingId);
        res.json(sighting);
    });
};

exports.list = function(req, res) {
    Sighting.find().sort('-sigthingDate').exec(function(err, sightings) {
        console.log(sightings);
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(sightings);
        }
    });
};

var fields = ['sigthingDate', 'waarnemingId', 'numberOfChicks', 'observerName', 'observerEmail', 'gezinEerderGemeld', 'habitat', 'remarks', 'lat', 'lng', 'age', 'permission', 'photo'];

exports.csv = function(req, res) {
    Sighting.find().sort('-sigthingDate').exec(function(err, sightings) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        }
        else {
            json2csv({ data: sightings, fields: fields, del: ';' }, function(err, tsv) {
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

exports.writeZip = function(req, res) {
    var basedir = 'public/img/',
        dir = basedir + 'uploads/',
        zipName = 'jsd-photos.zip',
        downloaddir = 'img/' + zipName,
        fileArray = getDirectoryList(dir),
        output = fs.createWriteStream(basedir + zipName),
        archive = archiver('zip');

    console.log('Filearray: '+fileArray);

    archive.on('error', function(err) {
        console.error(err);
        res.status(500).send({error: err.message});
    });

    output.on('close', function() {
        console.log('Archive wrote %d bytes', archive.pointer());
        return res.status(200).send(downloaddir).end();
    });

    res.attachment('myzip.zip');

    archive.pipe(output);

    fileArray.forEach(function(item){
        if(item.name !== '.DS_Store') {
            var file = item.path + item.name;
            archive.append(fs.createReadStream(file), { name: item.name });
        }
    });

    console.log('Archive: ' + archive);

    archive.finalize();
};

exports.deletefotos = function(req, res) {
    var basedir = 'public/img/',
        dir = basedir + 'uploads/',
        message = deleteDirectoryContent(dir);


    res.status(message.status).send(message.message).end();
};

function deleteDirectoryContent(dir) {
    var files = fs.readdirSync(dir);
    files.forEach(function(file){
        console.log("Deleting file:" + file);
        fs.unlink(dir+file, function(err) {
            if(err) {
                console.log("Error: " +err);
                throw err
            }
        });
    });
    console.log("Deleting fotos completed");
    return {status: 200, message: 'OK'};
}

function getDirectoryList(dir){
    var fileArray = [],
        files = fs.readdirSync(dir);
    files.forEach(function(file){
        var obj = {name: file, path: dir};
        fileArray.push(obj);
        console.log(obj)
    });
    return fileArray;
};

exports.sightingByID = function(req, res, next, id) {
    Sighting.findById(id).exec(function(err, sighting) {
        if (err) return next(err);
        if (!sighting) return next(new Error('Het is niet gelukt de volgende waarneming te laden: ' + id));

        req.sighting = sighting;
        next();
    });
};

exports.read = function(req, res) {
    res.json(req.sighting);
};

exports.delete = function(req, res) {
    var sighting = req.sighting;

    sighting.remove(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(sighting);
        }
    });
};

/*
exports.update = function(req, res) {
    var sighting = req.sighting;

    sighting.title = req.body.title;
    sighting.content = req.body.content;

    sighting.save(function(err) {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.json(sighting);
        }
    });
};

 exports.hasAuthorization = function(req, res, next) {
 if (req.article.creator.id !== req.user.id) {
 return res.status(403).send({
 message: 'User is not authorized'
 });
 }
 next();
 };

*/
