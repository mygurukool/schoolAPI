const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const invitationSchema = mongoose.Schema({
    groupId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    organizationId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    groupName: {
        type: String,
        required: false
    },
    invitedBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: false
    },
    inviteeName: {
        type: String,
        required: false
    },
    inviteeEmail: {
        type: String,
        required: false
    },
    type: {
        type: String,
        required: false
    },
    peoples: {
        type: Array,
        required: false
    }
});


invitationSchema.plugin(toJSON);
invitationSchema.plugin(paginate);

const Invitation = mongoose.model('Invitation', invitationSchema);

module.exports = Invitation;