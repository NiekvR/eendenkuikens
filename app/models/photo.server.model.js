var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PhotoSchema = Schema({
    waarnemingId: {
        type: String
    },
    base64: {
        type: String
    }

});

mongoose.model('Photo', PhotoSchema);