const httpStatus = require("http-status");
const { ObjectId } = require("mongodb");
const { axiosMiddleware } = require("../middlewares/axios");
const { Group, User, UploadFile } = require("../models");
const { courseApis } = require("../utils/gapis");

const filterOutCurrentUser = ({ userId, data }) => {
  return data.filter((a) => a.id !== userId || a._id !== userId);
};

const getTeachers = async ({
  groupId,
  userId,
  courseId,
  returnCurrentUser,
  loginType,
  request: req,
}) => {
  try {
    if (loginType === "mygurukool") {
      const group = await Group.findById(groupId);
      const groupTeachers = await Promise.all(
        group.teachers.map(async (t) => {
          const user = await User.findById(t.id || t._id);
          return user;
        })
      );
      return {
        status: httpStatus.OK,
        data: returnCurrentUser
          ? groupTeachers
          : filterOutCurrentUser({ userId, data: groupTeachers }),
      };
    } else if (loginType === "google") {
      const courseTeachers = await axiosMiddleware(
        { url: courseApis.getCourseTeachers(courseId) },
        req
      );
      const teachers = await Promise.all(
        courseTeachers.teachers.map((t) => {
          return {
            courseId: t.courseId,
            id: t.userId,
            name: t.profile.name.fullName,
          };
        })
      );

      return {
        status: httpStatus.OK,
        data: returnCurrentUser
          ? teachers
          : filterOutCurrentUser({ userId, data: teachers }),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to get teachers ",
    };
  }
};

const getStudents = async ({
  groupId,
  userId,
  courseId,
  returnCurrentUser,
  loginType,
  request: req,
}) => {
  try {
    if (loginType === "mygurukool") {
      const group = await Group.findById(groupId);

      const groupStudents = await Promise.all(
        group.students.map(async (t) => {
          const user = await User.findById(t.id || t._id);
          return user;
        })
      );

      return {
        status: httpStatus.OK,
        data: returnCurrentUser
          ? groupStudents
          : filterOutCurrentUser({ userId, data: groupStudents }),
      };
    } else if (loginType === "google") {
      const courseStudents = await axiosMiddleware(
        { url: courseApis.getCourseStudents(courseId) },
        req
      );
      const students = await Promise.all(
        courseStudents.students.map((t) => {
          return {
            courseId: t.courseId,
            id: t.userId,
            name: t.profile.name.fullName,
          };
        })
      );

      return {
        status: httpStatus.OK,
        data: returnCurrentUser
          ? students
          : filterOutCurrentUser({ userId, data: students }),
      };
    }
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to get students",
    };
  }
};

const remove = async (data) => {
  try {
    await Group.findByIdAndUpdate(data.groupId, {
      $pull: {
        users: data.id,
        teachers: ObjectId(data.id),
        students: ObjectId(data.id),
      },
    });
    return { status: httpStatus.OK, message: "Deleted Successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to delete",
    };
  }
};

const uploadFile = async (req) => {
  try {
    const userId = req.userId;
    req.body.fileId =
      req.body.fileId !== "undefined" ? req.body.fileId : undefined;
    const created = await UploadFile.create({
      ...req.body,
      studentId: userId,
      file: req.files[0],
    });
    return {
      status: httpStatus.OK,
      message: "File Uploaded Successfully",
      data: created,
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to upload file",
    };
  }
};

const deleteFile = async (query, userId) => {
  try {
    const { assignmentId, id, fileId } = query;
    console.log(query);
    if (id) {
      await UploadFile.findByIdAndDelete(id);
    } else {
      await UploadFile.findOneAndDelete({
        studentId: userId,
        assignmentId: assignmentId,
      });
    }
    return {
      status: httpStatus.OK,
      message: "File Deleted Successfully",
      data: { fileId: fileId, assignmentId: assignmentId, id: id },
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to delete file",
    };
  }
};

module.exports = {
  getTeachers,
  getStudents,
  remove,
  uploadFile,
  deleteFile,
};
