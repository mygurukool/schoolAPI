const mongoose = require("mongoose");
const { toJSON, paginate } = require("./plugins");

const courseSchema = mongoose.Schema({
  groupId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
  },
  organizationId: {
    type: mongoose.SchemaTypes.ObjectId,
    required: false,
  },
  courseName: {
    type: String,
    required: true,
  },
  courseLogo: {
    type: String,
    required: false,
  },
});

courseSchema.plugin(toJSON);
courseSchema.plugin(paginate);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
