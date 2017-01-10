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
    }

});

SightingSchema.plugin(autoIncrement.plugin, { model: 'Sighting', field: 'waarnemingIdCount' });
mongoose.model('Sighting', SightingSchema);