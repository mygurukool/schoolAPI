const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const pricingSchema = mongoose.Schema({
    packageName: {
        type: String,
        required: false
    },
    prices: {
        type: Array,
        required: false
    },
    userSize: {
        type: String,
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