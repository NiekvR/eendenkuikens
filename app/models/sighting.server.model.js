var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SightingSchema = Schema({
    sigthingDate: {
        type: Date,
        required: 'De datum moet worden ingevuld'
    },
    numberOfChicks: {
        type: Number,
        required: 'Het aantal kuikens moet worden ingevuld'
    },
    observerName: {
        type: String,
        trim: true
    },
    observerEmail: {
        type: String,
        match: [/.+\@.+\..+/, "Het emailadres voldoet niet aan de eisen, bijv. email@email.com"]
    },
    remarks: {
        type: String,
        trim: true
    },
    lat: {
        type: String,
        trim: true
    },
    lng: {
        type: String,
        trim: true
    },
    age: {
        type: String,
        trim: true
    },
    permission: {
        type: Boolean,
        required: 'Je moet de voorwaarden accepteren om uw waarneming in te sturen.'
    },
    photo: {
        type: String
    }

});

mongoose.model('Sighting', SightingSchema);