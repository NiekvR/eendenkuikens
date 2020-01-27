var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    config = require('../../config/config'),
    autoIncrement = require('mongoose-auto-increment');

var connection = mongoose.createConnection(config.db);

autoIncrement.initialize(connection);

var SightingSchema = Schema({
    waarnemingId: {
        type: String
    },
    waarnemingIdCount: {
        type: Number
    },
    species: {
        type: String
    },
    sigthingDate: {
        type: Date,
        required: 'De datum moet ingevuld zijn voordat de waarneming verstuurd kan worden.'
    },
    numberOfChicks: {
        type: Number,
        required: 'Het aantal kuikens moet ingevuld zijn voordat de waarneming verstuurd kan worden.'
    },
    observerName: {
        type: String,
        trim: true
    },
    observerEmail: {
        type: String,
        match: [/.+\@.+\..+/, "Het emailadres voldoet niet aan de eisen, bijv. email@email.com"]
    },
    gezinEerderGemeld: {
        type: Boolean
    },
    gezinEerderGemeldWithId: {
        type: String
    },
    habitat: {
        type: String
    },
    remarks: {
        type: String,
        trim: true
    },
    lat: {
        type: String,
        trim: true,
        required: 'De locatie van de waarneming moet aangegeven worden op de kaart voordat deze verstuurd kan worden.'
    },
    lng: {
        type: String,
        trim: true,
        required: 'De locatie van de waarneming moet aangegeven worden op de kaart voordat deze verstuurd kan worden.'
    },
    age: {
        type: String,
        trim: true,
        required: 'De leeftijd van de kuikens moet geschat worden voor de waarneming ingestuurd kan worden.'
    },
    permission: {
        type: Boolean,
        required: 'Je moet de voorwaarden accepteren om uw waarneming in te sturen.'
    },
    photo: {
        type: String
    },
    surface: {
        type: String
    },
    shore: {
        type: String
    },
    water: {
        type: String
    },
    numberOfDeaths: {
        type: Number
    },
    causeOfDeath: {
        type: String
    },
    extraFeedings: {
        type: String
    },
    version: {
        type: String,
        required: 'Deze versie van de applicatie wordt niet meer ondersteund. Gooi deze applicatie van je telefoon en ga naar www.kuikenteller.nl voor de nieuwste versie'
    }


});

SightingSchema.plugin(autoIncrement.plugin, { model: 'Sighting', field: 'waarnemingIdCount', startAt: 0 });
mongoose.model('Sighting', SightingSchema);
