const httpStatus = require("http-status");
const { coursesService } = require(".");
const { axiosMiddleware } = require("../middlewares/axios");
const { Group, Organization, User } = require("../models");
const { findUserInArray } = require("../utils/functions");
const { courseApis } = require("../utils/gapis");
const { PERMISSIONS, ROLES } = require("../utils/permissions");
const platforms = require("../utils/platforms");
const { getTeachers } = require("./user.service");

const getPermissions = async (role) => {
  return await PERMISSIONS[role];
};

const all = async (req) => {
  try {
    let groups = [];

    await Promise.all(
      req.loginTypes.map(async (lt) => {
        // console.log("req", req);
        // console.log("lt", lt);

        if (lt.platformName === platforms.MOUGLI) {
          const allgroups = await Group.find({ users: { $in: [req.userId] } });
          if (allgroups) {
            await Promise.all(
              allgroups.map(async (c) => {
                const org = await Organization.findById(c.organizationId);
                const isTeacher = await User.findOne({
                  "groups.groupId": c._id,
                  "groups.role": ROLES.teacher,
                });
                if (isTeacher) {
                  groups.push({
                    ...c._doc,
                    organizationName: org.organizationName,
                    organizationId: org._id || org.id,

                    permissions: PERMISSIONS[ROLES.teacher],
                  });
                } else {
                  groups.push({
                    ...c._doc,
                    organizationName: org.organizationName,
                    organizationId: org._id || org.id,

                    permissions: PERMISSIONS[ROLES.student],
                  });
                }
              })
            );
          }
        }
        if (lt.platformName === platforms.GOOGLE) {
          const courseResponse = await coursesService.all(req);
          const isCourseTeacher = courseResponse.data.some(
            (a) => a.ownerId === req.userId
          );
          await Promise.all(
            courseResponse.data.map(async (c) => {
              const teachers = await getTeachers({
                courseId: c.id,
                userId: req.userId,
                returnCurrentUser: true,
                loginType: req.loginTypes,
                request: req,
              });

              const isTeacher = teachers.data.some((t) => t.id === lt.userId);

              groups.push({
                groupName: c.section,
                permissions:
                  isTeacher || isCourseTeacher
                    ? PERMISSIONS["TEACHER"]
                    : PERMISSIONS["STUDENT"],
                platformName: platforms.GOOGLE,
              });
            })
          );
        }
      })
    );
    const filteredGroups = [];
    await Promise.all(
      groups.map((g) => {
        if (g.platformName === platforms.GOOGLE) {
          const existing = filteredGroups.findIndex(
            (a) => a.groupName === g.groupName
          );
          if (existing > -1) {
            filteredGroups[existing] = {
              ...filteredGroups[existing],
              ...g,
            };
          } else {
            filteredGroups.push(g);
          }
        } else {
          return filteredGroups.push(g);
        }
      })
    );

    return {
      status: httpStatus.OK,
      data: {
        groups: filteredGroups,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create group",
    };
  }
};

const create = async (req) => {
  // console.log("req", req.body);
  try {
    const data = req.body;
    const checkIfExist = await Group.findOne(data);

    if (checkIfExist) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Group name already exist",
      };
    }
    const normalExist = await Group.find({
      users: { $in: [JSON.stringify(req.userId)] },
      groupName: data.groupName,
    });
    console.log("normalExist", normalExist);
    if (normalExist) {
      return { status: httpStatus.OK, message: "Group created successfully" };
    }
    const checkOrg = await Organization.findOne({ userId: req.userId });
    // console.log("checkOrg", checkOrg);
    // let teachers = [];
    // if (checkOrg.organizationSize === "1") {
    //   const user = await User.findById(req.userId);
    //   teachers = [user._id || user.id];
    // }

    console.log("grop create data", data);
    const createdGroup = await Group.create({
      ...data,
      users: [req.userId],
      organizationId: checkOrg._id,
    });

    if (!createdGroup) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to create group",
      };
    }
    const updatedUser = await User.findByIdAndUpdate(req.userId, {
      $push: {
        groups: [
          {
            groupId: createdGroup?._id || createdGroup?._id,
            role: ROLES.teacher,
          },
        ],
      },
    });

    if (!updatedUser) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Failed to create group",
      };
    }

    return { status: httpStatus.OK, message: "Group created successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create group",
    };
  }
};

const update = async (data) => {
  try {
    const checkIfExist = await Group.findOne({
      groupName: data.groupName,
      organizationId: data.organizationId,
    });
    if (checkIfExist && checkIfExist.groupName != data.groupName) {
      const checkGroup = Group.find({
        groupName: data.groupName,
        _id: data.id || data.id,
      });
      if (checkGroup.length > 0) {
        return {
          status: httpStatus.INTERNAL_SERVER_ERROR,
          message: "Group name already exist!",
        };
      }
    }
    await Group.findByIdAndUpdate(data.id || data._id, data);
    return { status: httpStatus.OK, message: "Group updated successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to update ",
    };
  }
};

const remove = async (data) => {
  try {
    await Group.findByIdAndDelete(data.id || data._id);
    return { status: httpStatus.OK, message: "Group deleted successfully" };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to delete group",
    };
  }
};

module.exports = {
  all,
  create,
  update,
  remove,
};

// const httpStatus = require("http-status");
// const { axiosMiddleware } = require("../middlewares/axios");
// const { Group, Organization, User } = require("../models");
// const { courseApis } = require("../utils/gapis");
// const PERMISSIONS = require("../utils/permissions");
// const { getTeachers } = require("./user.service");

// const all = async (req) => {
//   try {
//     if (req.loginType === "mygurukool") {
//       const allgroups = await Group.find({ users: { $in: [req.userId] } });
//       const user = await User.findById(req.userId);
//       const groups = await Promise.all(
//         allgroups.map(async (c) => {
//           const org = await Organization.findById(c.organizationId);
//           return {
//             ...c._doc,
//             organizationName: org.organizationName,
//             permissions: user.permissions,
//           };
//         })
//       );
//       return { status: httpStatus.OK, data: groups };
//     } else if (req.loginType === "google") {
//       const courses = await axiosMiddleware(
//         {
//           url: courseApis.getCourses(),
//         },
//         req
//       );
//       let groups = [];

//       const isCourseTeacher = courses.courses.some(
//         (a) => a.ownerId === req.userId
//       );

// await Promise.all(
//   courses.courses.map(async (c) => {
//     const teachers = await getTeachers({
//       courseId: c.id,
//       userId: req.userId,
//       returnCurrentUser: true,
//       loginType: req.loginType,
//       request: req,
//     });

//     const isTeacher = teachers.data.some((t) => t.id === req.userId);

//     groups.push({
//       groupName: c.section,
//       permissions:
//         isTeacher || isCourseTeacher
//           ? PERMISSIONS["TEACHER"]
//           : PERMISSIONS["STUDENT"],
//     });
//   })
//       );

//       return {
//         status: httpStatus.OK,
//         data: {
//           groups,
//         },
//       };
//     }
//   } catch (error) {
//     console.log(error);
//     return {
//       status: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to create group",
//     };
//   }
// };

// const create = async (req) => {
//   try {
//     const data = req.body;
//     const checkIfExist = await Group.findOne(data);
//     if (checkIfExist) {
//       return {
//         status: httpStatus.INTERNAL_SERVER_ERROR,
//         message: "Group name already exist",
//       };
//     }
//     const checkOrg = await Organization.findOne({ userId: req.userId });
//     let teachers = [];
//     if (checkOrg.organizationSize === "1") {
//       const user = await User.findById(req.userId);
//       teachers = [user._id || user.id];
//     }
//     await Group.create({ ...data, users: [req.userId], teachers: teachers });
//     return { status: httpStatus.OK, message: "Group created successfully" };
//   } catch (error) {
//     console.log(error);
//     return {
//       status: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to create group",
//     };
//   }
// };

// const update = async (data) => {
//   try {
//     const checkIfExist = await Group.findOne({
//       groupName: data.groupName,
//       organizationId: data.organizationId,
//     });
//     if (checkIfExist && checkIfExist.groupName != data.groupName) {
//       const checkGroup = Group.find({
//         groupName: data.groupName,
//         _id: data.id || data.id,
//       });
//       if (checkGroup.length > 0) {
//         return {
//           status: httpStatus.INTERNAL_SERVER_ERROR,
//           message: "Group name already exist!",
//         };
//       }
//     }
//     await Group.findByIdAndUpdate(data.id || data._id, data);
//     return { status: httpStatus.OK, message: "Group updated successfully" };
//   } catch (error) {
//     console.log(error);
//     return {
//       status: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to update ",
//     };
//   }
// };

// const remove = async (data) => {
//   try {
//     await Group.findByIdAndDelete(data.id || data._id);
//     return { status: httpStatus.OK, message: "Group deleted successfully" };
//   } catch (error) {
//     console.log(error);
//     return {
//       status: httpStatus.INTERNAL_SERVER_ERROR,
//       message: "Failed to delete group",
//     };
//   }
// };

// module.exports = {
//   all,
//   create,
//   update,
//   remove,
// };
