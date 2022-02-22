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
    students: {
        type: Array,
        required: false,
    },
    teachers: {
        type: Array,
        required: false,
    },
    users: {
        type: Array,
        required: false,
    },
    groupName: {
        type: String,
        required: true
    },
    ageGroupId: {
        type: String,
        required: false
    }
});


groupSchema.plugin(toJSON);
groupSchema.plugin(paginate);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;