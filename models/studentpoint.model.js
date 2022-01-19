const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const studentPointSchema = mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false
    },
    studentId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: false
    },
    points: {
      type: Number,
      required: false
    }

  },
  {
    timestamps: true,
  }
);


studentPointSchema.plugin(toJSON);
studentPointSchema.plugin(paginate);

const StudentPoint = mongoose.model('StudentPoint', studentPointSchema);

module.exports = StudentPoint;
