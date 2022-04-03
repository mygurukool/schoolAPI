const httpStatus = require("http-status");
const { User, Organization } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const platforms = require("../utils/platforms");

const create = async (data) => {
  try {
    await User.findOneAndDelete({ email: data.email });
    const user = await User.findOne({ email: data.email });
    if (user) {
      return {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "User already exist",
      };
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, salt);
    const newuser = await User.create({ ...data, password: hashPassword });
    const token = jwt.sign({ _id: newuser._id }, process.env.JWT_SECRET);
    const organization = await Organization.create({
      ...data,
      organizationEmail: data.email,
      userId: newuser._id,
      organizationCountry: data.country,
    });
    await User.findByIdAndUpdate(newuser._id, {
      $push: {
        organizations: organization.id || organization._id,
        loginTypes: [{ userId: newuser._id, platformName: platforms.MOUGLI }],
      },
    });
    return {
      status: httpStatus.OK,
      token: token,
      user: newuser,
      message: "Organization created successfully",
    };
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
