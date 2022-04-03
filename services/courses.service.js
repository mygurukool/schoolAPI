const httpStatus = require("http-status");
const { axiosMiddleware } = require("../middlewares/axios");
const { Course } = require("../models");
const { courseApis } = require("../utils/gapis");
const fs = require("fs");
const platforms = require("../utils/platforms");
const { getCourseIcons } = require("../utils/functions");
const { ObjectID } = require("mongodb");

const all = async (req) => {
  try {
    let courses = [];
    console.time("startall");

    await Promise.all(
      req.loginTypes.map(async (lt) => {
        console.time("startloop");

        if (lt.platformName === platforms.MOUGLI) {
          //mougli

          if (Object.keys(req.query).length > 0) {
            const foundCourses = await Course.find({
              groupId: req.query.groupId,
            });

            if (foundCourses) {
              await Promise.all(
                foundCourses.map(async (c) => {
                  courses.push({
                    ...c._doc,
                    courseImage: await getCourseIcons(c.courseName),
                  });
                })
              );
            }
          }
        }
        if (lt.platformName === platforms.GOOGLE) {
          //google
          const gcourses = await axiosMiddleware(
            { url: courseApis.getCourses() },
            req
          );
          if (gcourses) {
            // console.log("courses", gcourses);
            await Promise.all(
              gcourses.courses.map(async (c) => {
                courses.push({
                  ...c,
                  courseName: c.name,
                  courseImage: await getCourseIcons(c.name),
                });
              })
            );
          }
        }
        console.timeEnd("startloop");
      })
    );

    console.timeEnd("startall");
    console.log("courses", courses);

    return { status: httpStatus.OK, data: courses };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const create = async (req) => {
  try {
    const data = req.body;
    await Promise.all(
      data.groupId.map(async (g) => {
        await Course.create({ ...data, groupId: g });
      })
    );
    return { status: httpStatus.OK, message: "Course created successfully" };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const update = async (req) => {
  try {
    const data = req.body;
    if (req.loginType === "mygurukool") {
      delete data.groupId;
      // const checkIfExist = await Course.findOne({ courseName: data.courseName, organizationId: data.organizationId })
      // if (checkIfExist && checkIfExist.courseName != data.courseName) {
      //     const check = Course.find({ courseName: data.courseName, _id: data.id || data.id })
      //     if (check.length > 0) {
      //         return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Course name already exist!" })
      //     }
      // }
      await Course.findByIdAndUpdate(data.id || data._id, data);
      return { status: httpStatus.OK, message: "Course updated successfully" };
    }
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const remove = async (req) => {
  try {
    const data = req.body;
    if (req.loginType === "mygurukool") {
      await Course.findByIdAndDelete(data.id || data._id);
      return { status: httpStatus.OK, message: "Course deleted successfully" };
    }
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

const assignmentList = async (req) => {
  try {
    const { courseId } = req.query;
    const assignments = await axiosMiddleware(
      { url: courseApis.getAssignments(courseId) },
      req
    );
    const courseTeachers = await axiosMiddleware(
      { url: courseApis.getCourseTeachers(courseId) },
      req
    );
    const courseStudents = await axiosMiddleware(
      { url: courseApis.getCourseStudents(courseId) },
      req
    );
    const teachers = await Promise.all(
      courseTeachers.teachers.map((t) => {
        return {
          courseId: t.courseId,
          teacherId: t.userId,
          name: t.profile.name.fullName,
          permissions: t.profile.permissions,
        };
      })
    );
    const students = await Promise.all(
      courseStudents.students.map((t) => {
        return {
          courseId: t.courseId,
          studentId: t.userId,
          name: t.profile.name.fullName,
          permissions: t.profile.permissions,
        };
      })
    );
    // console.log('courseTeachers', students);
    return {
      status: httpStatus.OK,
      data: {
        assignments: assignments.courseWork,
        teachers: teachers,
        students: students,
      },
    };
  } catch (error) {
    console.log(error);
    return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
  assignmentList,
};

// const httpStatus = require("http-status");
// const { axiosMiddleware } = require("../middlewares/axios");
// const { Course } = require("../models");
// const { courseApis } = require("../utils/gapis");
// const fs = require("fs");

// const getCourseIcons = async (courseName) => {
//   const dir = "uploaded/course_icons/";

//   let subjectIcon = `default.jpg`;
//   const files = await fs.promises.readdir(dir);
//   // console.log('files', files);
//   files.forEach((icon) => {
//     // console.log(icon);
//     let lastIndexOfbackSlash = icon.lastIndexOf("/");
//     let regex = new RegExp(courseName.toLowerCase(), "i");
//     if (
//       courseName
//         .toLowerCase()
//         .includes(
//           icon.substring(
//             lastIndexOfbackSlash + 1,
//             icon.indexOf(".", lastIndexOfbackSlash)
//           )
//         )
//     ) {
//       subjectIcon = icon;
//     }
//   });
//   return dir + subjectIcon;
// };

// const all = async (req) => {
//   try {
//     if (req.loginType === "mygurukool") {
//       if (Object.keys(req.query).length <= 0) {
//         return { status: httpStatus.OK, data: [] };
//       }
//       const courses = await Course.find(req.query);
//       const newCourse = await Promise.all(
//         courses.map(async (c) => {
//           return { ...c._doc, courseImage: await getCourseIcons(c.courseName) };
//         })
//       );

//       return { status: httpStatus.OK, data: newCourse };
//     } else if (req.loginType === "google") {
//       const courses = await axiosMiddleware(
//         { url: courseApis.getCourses() },
//         req
//       );
//       const newCourse = await Promise.all(
//         courses.courses.map(async (c) => {
//           return {
//             ...c,
//             courseName: c.name,
//             courseImage: await getCourseIcons(c.name),
//           };
//         })
//       );

//       return { status: httpStatus.OK, data: newCourse };
//     }
//   } catch (error) {
//     console.log(error);
//     return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
//   }
// };

// const create = async (req) => {
//   try {
//     const data = req.body;
//     if (req.loginType === "mygurukool") {
//       await Promise.all(
//         data.groupId.map(async (g) => {
//           await Course.create({ ...data, groupId: g });
//         })
//       );
//       return { status: httpStatus.OK, message: "Course created successfully" };
//     }
//   } catch (error) {
//     console.log(error);
//     return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
//   }
// };

// const update = async (req) => {
//   try {
//     const data = req.body;
//     if (req.loginType === "mygurukool") {
//       delete data.groupId;
//       // const checkIfExist = await Course.findOne({ courseName: data.courseName, organizationId: data.organizationId })
//       // if (checkIfExist && checkIfExist.courseName != data.courseName) {
//       //     const check = Course.find({ courseName: data.courseName, _id: data.id || data.id })
//       //     if (check.length > 0) {
//       //         return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Course name already exist!" })
//       //     }
//       // }
//       await Course.findByIdAndUpdate(data.id || data._id, data);
//       return { status: httpStatus.OK, message: "Course updated successfully" };
//     }
//   } catch (error) {
//     console.log(error);
//     return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
//   }
// };

// const remove = async (req) => {
//   try {
//     const data = req.body;
//     if (req.loginType === "mygurukool") {
//       await Course.findByIdAndDelete(data.id || data._id);
//       return { status: httpStatus.OK, message: "Course deleted successfully" };
//     }
//   } catch (error) {
//     console.log(error);
//     return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
//   }
// };

// const assignmentList = async (req) => {
//   try {
//     const { courseId } = req.query;
//     const assignments = await axiosMiddleware(
//       { url: courseApis.getAssignments(courseId) },
//       req
//     );
//     const courseTeachers = await axiosMiddleware(
//       { url: courseApis.getCourseTeachers(courseId) },
//       req
//     );
//     const courseStudents = await axiosMiddleware(
//       { url: courseApis.getCourseStudents(courseId) },
//       req
//     );
//     const teachers = await Promise.all(
//       courseTeachers.teachers.map((t) => {
//         return {
//           courseId: t.courseId,
//           teacherId: t.userId,
//           name: t.profile.name.fullName,
//           permissions: t.profile.permissions,
//         };
//       })
//     );
//     const students = await Promise.all(
//       courseStudents.students.map((t) => {
//         return {
//           courseId: t.courseId,
//           studentId: t.userId,
//           name: t.profile.name.fullName,
//           permissions: t.profile.permissions,
//         };
//       })
//     );
//     // console.log('courseTeachers', students);
//     return {
//       status: httpStatus.OK,
//       data: {
//         assignments: assignments.courseWork,
//         teachers: teachers,
//         students: students,
//       },
//     };
//   } catch (error) {
//     console.log(error);
//     return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
//   }
// };

// module.exports = {
//   all,
//   create,
//   update,
//   remove,
//   assignmentList,
// };
