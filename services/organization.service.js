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
        // if (data.currentGroup) {
        //   const createdGroup = await Group.create({
        //     ...data.currentGroup,
        //     users: [newuser._id.toString()],
        //     organizationId: organization._id,
        //   });
        // }
        return {
          status: httpStatus.OK,
          token: token,
          user: newuser,
          organization: organization,
          message: "Organization created successfully",
        };
      }
    } else {
      const organization = await Organization.create({
        ...data,
        organizationEmail: data.email,
        userId: user._id,
        organizationCountry: data.country,
      });
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      const updatedUser = await User.findByIdAndUpdate(user._id, {
        $push: {
          organizations: organization.id || organization._id,

          loginTypes: { userId: user._id, platformName: platforms.MOUGLI },
          tokens: {
            token: token,
            platformName: platforms.MOUGLI,
          },
        },
      });
      // console.log("updateUser", updatedUser);
      if (data.currentGroup) {
        const createdGroup = await Group.create({
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

module.exports = {
  create,
};
