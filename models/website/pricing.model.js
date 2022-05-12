const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const pricingSchema = mongoose.Schema({
    language: {
        type: String,
        required: false
    },
    pricing: {
        type: Array,
        required: false
    },
},
    {
        timestamps: true,
    }
);


pricingSchema.plugin(toJSON);
pricingSchema.plugin(paginate);

const Pricing = mongoose.model('Pricing', pricingSchema);

module.exports = Pricing;