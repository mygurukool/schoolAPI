const httpStatus = require('http-status');
const { User, Organization, } = require('../models')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const create = async (data) => {
    try {
        await User.findOneAndDelete({ email: data.email });

        const users = await User.findOne({ email: data.email });
        if (users) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "User already exist" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password, salt);
        const user = await User.create({ ...data, password: hashPassword })
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        await Organization.create({ ...data, userId: user._id, organizationCountry: data.country })
        return ({ status: httpStatus.OK, token: token, user: user, message: "Organization created successfully" });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }

}


module.exports = {
    create
}
