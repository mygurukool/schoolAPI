const httpStatus = require("http-status");
const { User, Organization } = require("../../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const { Transaction } = require("../../models/website");
const moment = require("moment");

const login = async (data) => {
    try {
        const user = await User.findOne({ email: data.email });

        if (!user) {
            return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "User does not exist" });
        }
        const validPassword = await bcrypt.compare(data.password, user.password);
        if (!validPassword)
            return ({ status: httpStatus.NOT_FOUND, message: "Invalid password" });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        const organization = await Organization.findById(user.organizationId);
        const transaction = await Transaction.findOne({ organizationId: user.organizationId, userId: user._id })
        return {
            status: httpStatus.OK,
            user: user,
            organization: organization,
            transaction: transaction,
            token: token,
            message: "Logined In Successfully",
        };
    } catch (error) {
        console.log(error);
        return { status: httpStatus.INTERNAL_SERVER_ERROR, message: error };
    }
};


const register = async (data) => {
    try {
        const users = await User.findOne({ email: data.email });
        if (users) {
            return {
                status: httpStatus.INTERNAL_SERVER_ERROR,
                message: "User already exist",
            };
        }
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(data.password, salt);
        const user = await User.create({ ...data, password: hashPassword });
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        const price = data.package.prices.find(p => p.amount === data.price)
        const expire = price.duration > 0 ? moment().add(price.duration, 'months').endOf("day").toDate() : undefined
        const organization = await Organization.create({
            ...data,
            organizationEmail: data.email,
            userId: user._id,
            organizationCountry: data.country,
            organizationSize: data.package.size,
            expiredAt: expire
        });
        await User.findByIdAndUpdate(user._id, { organizationId: organization.id || organization._id })
        const transaction = await Transaction.create({
            sessionId: data.transaction ? data.transaction.id : undefined,
            transactionDetails: data.transaction,
            paymentId: data.transaction ? data.transaction.payment_intent : undefined,
            productType: data.package,
            priceType: price,
            organizationId: organization.id || organization._id,
            userId: user._id,
            expiredAt: expire
        })
        return {
            status: httpStatus.OK,
            token: token,
            user: user,
            organization: organization,
            transaction: transaction,
            message: "Registration successfully completed",
        };
    } catch (error) {
        console.log(error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to register",
        };
    }

};

const update = async (data) => {
    try {
        const user = await User.findByIdAndUpdate(data.userId, data, { new: true })
        const organization = await Organization.findByIdAndUpdate(data.organizationId, data, { new: true })
        return {
            status: httpStatus.OK,
            user: user,
            organization: organization,
            message: "Details updated successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to update",
        };
    }

};

const details = async (req) => {
    try {
        const token = req.header("Authorization");

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).send({ message: "Access denied" });
        }
        const userId = verified._id;
        const user = await User.findOne({ _id: userId });

        if (!user) {
            return { status: httpStatus.NOT_FOUND, message: "user does not exist" };
        }
        const organization = await Organization.findById(user.organizationId);
        const transaction = await Transaction.findOne({ organizationId: user.organizationId, userId: user._id })

        return {
            status: httpStatus.OK,
            user: user,
            organization: organization,
            transaction: transaction,
            loginType: "mygurukool",
            message: "User details found successfully",
        };
    } catch (error) {
        console.log(error);
        return {
            status: httpStatus.INTERNAL_SERVER_ERROR,
            message: "Failed to get details",
        };
    }
};

module.exports = {
    login,
    details,
    register,
    update
};
