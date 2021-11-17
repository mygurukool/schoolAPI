const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const organizationSchema = mongoose.Schema({
    organizationName: {
        type: String,
        required: true
    },
    organizationSize: {
        type: String,
        required: true,
    },
    organizationAddress: {
        type: String,
        required: true
    },
    organizationCountry: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    }
});


organizationSchema.plugin(toJSON);
organizationSchema.plugin(paginate);

const Organization = mongoose.model('Organization', organizationSchema);

module.exports = Organization;