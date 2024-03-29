const httpStatus = require("http-status");
const { axiosMiddleware } = require("../middlewares/axios");
const { Group, Organization, User } = require("../models");
const { courseApis } = require("../utils/gapis");

const all = async (req) => {
  try {
    if (req.loginType === "mygurukool") {
      const allgroups = await Group.find({ users: { $in: [req.userId] } });
      const groups = await Promise.all(
        allgroups.map(async (c) => {
          const org = await Organization.findById(c.organizationId);
          return { ...c._doc, organizationName: org.organizationName };
        })
      );
      return { status: httpStatus.OK, data: groups };
    } else if (req.loginType === "google") {
      const courses = await axiosMiddleware(
        { url: courseApis.getCourses() },
        req
      );
      console.log("groups", courses);
      let groups = [];
      await Promise.all(
        courses.courses.map((c) => {
          groups.push({ groupName: c.section });
        })
      );
      return { status: httpStatus.OK, data: groups };
    }
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create group",
    };
  }
};

const create = async (req) => {
  try {
    const data = req.body;
    const checkIfExist = await Group.findOne(data);
    if (checkIfExist) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Group name already exist",
      };
    }
    const checkOrg = await Organization.findOne({ userId: req.userId });
    let teachers = [];
    if (checkOrg.organizationSize === "1") {
      const user = await User.findById(req.userId);
      teachers = [user];
    }
    await Group.create({ ...data, users: [req.userId], teachers: teachers });
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
