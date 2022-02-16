const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const eventsSchema = mongoose.Schema({
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    organizationId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    groupId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    title: {
        type: String,
        required: false
    },
    start: {
        type: Date,
        required: false
    },
    end: {
        type: Date,
        required: false
    },
    users: [
        {
            id: {
                type: mongoose.SchemaTypes.ObjectId,
                required: false
            },
            status: {
                type: String,
                required: false,
            }
        }
    ],
    status: {
        type: String,
        required: false,
        default: "active"
    }
});


eventsSchema.plugin(toJSON);
eventsSchema.plugin(paginate);

const Events = mongoose.model('Events', eventsSchema);

module.exports = Events;