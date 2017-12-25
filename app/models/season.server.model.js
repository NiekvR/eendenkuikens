var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SeasonSchema = new Schema({
    date: {
        type: Date,
        required: 'Date required'
    },
    inSeason: Boolean,
});

mongoose.model('Season', SeasonSchema);