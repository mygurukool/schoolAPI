const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');

const transactionSchema = mongoose.Schema({
    sessionId: {
        type: String,
        required: false
    },
    transactionDetails: {
        type: Object,
        required: false
    },
    paymentId: {
        type: String,
        required: false
    },
    productType: {
        type: Object,
        required: false
    },
    priceType: {
        type: Object,
        required: false
    },
    organizationId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
    },
    sponsorId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false,
    },
    expiredAt: {
        type: Date,
        required: false
    }
}, {
    timestamps: true,
});


transactionSchema.plugin(toJSON);
transactionSchema.plugin(paginate);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;