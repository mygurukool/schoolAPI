const httpStatus = require("http-status");
const { User, Organization, Group } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const platforms = require("../utils/platforms");

const create = async (data) => {
  try {
    // console.log("data", data);

    // await User.findOneAndDelete({ email: data.email });
    const user = await User.findOne({ email: data.email });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);

    if (!user) {
      console.log("org if");
      const newuser = await User.create({ ...data, password: hashPassword });

      if (newuser) {
        const token = jwt.sign({ _id: newuser._id }, process.env.JWT_SECRET);

        const updatedUser = await User.findByIdAndUpdate(newuser._id, {
          loginTypes: [{ userId: newuser._id, platformName: platforms.MOUGLI }],
          tokens: [
            {
              token: token,
              platformName: platforms.MOUGLI,
            },
          ],
        });
        const organization = await Organization.create({
          ...data,
          organizationEmail: data.email,
          userId: newuser._id,
          organizationCountry: data.country,
        });
        await User.findByIdAndUpdate(newuser._id, {
          $push: {
            organizations: organization.id || organization._id,
          },
        });

        return {
          status: httpStatus.OK,
          token: token,
          user: newuser,
          organization: organization,
          message: "Organization created successfully",
        };
      }
    } else {
      console.log("org else");

      const organization = await Organization.create({
        ...data,
        organizationEmail: data.email,
        userId: user._id,
        organizationCountry: data.country,
      });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      const dataToUpdate = {
        organizations: [
          ...user.organizations,
          organization.id || organization._id,
        ],

        loginTypes: [
          ...user.loginTypes,
          { userId: user._id, platformName: platforms.MOUGLI },
        ],
        tokens: [
          ...user.tokens,
          {
            token: token,
            platformName: platforms.MOUGLI,
          },
        ],
      };
      const updatedUser = await User.findByIdAndUpdate(user._id, dataToUpdate);

      let createdGroup = null;
      // console.log("updateduser", updatedUser, dataToUpdate);
      if (data.currentGroup) {
        createdGroup = await Group.create({
          ...data.currentGroup,
          users: [updatedUser._id.toString()],
          userId: updatedUser._id,
          organizationId: organization._id,
        });
      }
      if (updatedUser) {
        return {
          status: httpStatus.OK,
          token: token,
          user: updatedUser,
          organization: organization,
          createdGroup: {
            ...createdGroup._doc,
          },
          tokens: updatedUser.loginTypes,
          userId: updatedUser._id,
          message: "Organization created successfully",
        };
      }
    }
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to create organization",
    };
  }
};

const changeUploadPermission = async (data) => {
  console.log("changeUploadPermission", data);
  try {
    await Organization.findByIdAndUpdate(data.organizationId, {
      uploadPermissionInfo: data,
    });
    return {
      status: httpStatus.OK,
      message: "Permission changed successfully",
      data: {
        permission: data.hasPermission,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to change permission",
    };
  }
};

const checkUploadPermission = async (data) => {
  try {
    const org = await Organization.findById(data.organizationId);
    let permission = false;
    if (org) {
      permission = org?.uploadPermissionInfo.hasPermission;
    }

    return {
      status: httpStatus.OK,
      message: "Permission changed successfully",
      data: {
        permission: permission,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: httpStatus.INTERNAL_SERVER_ERROR,
      message: "Failed to change permission",
    };
  }
};
module.exports = {
  create,
  changeUploadPermission,
  checkUploadPermission,
};
