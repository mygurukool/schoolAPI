const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const sponsorSchema = mongoose.Schema({
    sponsorName: {
        type: String,
        required: false
    },
    sponsorEmail: {
        type: String,
        required: false
    },
    sponsorAmount: {
        type: Number,
        required: false
    }
},
    {
        timestamps: true,
    }
);


sponsorSchema.plugin(toJSON);
sponsorSchema.plugin(paginate);

const Sponsor = mongoose.model('Sponsor', sponsorSchema);

module.exports = Sponsor;