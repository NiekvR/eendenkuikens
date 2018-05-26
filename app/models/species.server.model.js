var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpeciesSchema = new Schema({
    nameNL: {
        type: String,
        required: 'Species name required'
    },
    nameEN: {
        type: String,
    },
    familyLatin: {
        type: String,
    },
    speciesLatin: {
        type: String,
    },
    inUse: {
        type: Boolean,
        required: 'Is species in use or not'
    }
});

mongoose.model('Species', SpeciesSchema);