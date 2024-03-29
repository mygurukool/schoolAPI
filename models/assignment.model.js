const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const assignmentSchema = mongoose.Schema({
  groupId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "groups",
    required: true,
  },
  courseId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "courses",
    required: true,
  },

  userId: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "users",
    required: true,
  },
  assignmentTitle: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
    required: false,
  },
  students: {
    type: Array,
    required: false,
  },
  instructions: {
    type: String,
    required: false,
  },
  uploadExercises: {
    type: Array,
    required: false,
  },
  audioVideo: {
    type: Array,
    required: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

assignmentSchema.plugin(toJSON);
assignmentSchema.plugin(paginate);

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
