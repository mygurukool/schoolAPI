const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false
    },
    mobile: {
        type: String,
        required: false
    },
    website: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: false
    },
    subject: {
        type: String,
        required: false
    },
    schoolName: {
        type: String,
        required: false
    },
    contactPerson: {
        type: String,
        required: false
    },
    schoolMobile: {
        type: String,
        required: false
    },
    schoolWebsite: {
        type: String,
        required: false
    },
    schoolAddress: {
        type: String,
        required: false
    },
    productType: {
        type: String,
        required: false
    },
});


contactSchema.plugin(toJSON);
contactSchema.plugin(paginate);

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;