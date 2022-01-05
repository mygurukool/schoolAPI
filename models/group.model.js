const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const groupSchema = mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    organizationId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
});


groupSchema.plugin(toJSON);
groupSchema.plugin(paginate);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;