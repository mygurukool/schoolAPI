const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const uploadFileSchema = mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false
    },
    fileId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false
    },
    studentId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false
    },
    file: {
      type: Object,
      required: false
    }

  },
  {
    timestamps: true,
  }
);


uploadFileSchema.plugin(toJSON);
uploadFileSchema.plugin(paginate);

const UploadFile = mongoose.model('UploadFile', uploadFileSchema);

module.exports = UploadFile;
