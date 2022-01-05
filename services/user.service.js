const httpStatus = require('http-status');
const { User } = require('../models');

const getTeachers = async (data) => {
    try {
        const teachers = await User.find({ groupId: data.groupId, role: data.role })
        return ({ status: httpStatus.OK, data: teachers });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }
}

const getStudents = async (data) => {
    try {
        const students = await User.find({ groupId: data.groupId, role: data.role })
        return ({ status: httpStatus.OK, data: students });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });
    }
}

const remove = async (data) => {
    try {
        await User.findByIdAndDelete(data)
        return ({ status: httpStatus.OK, message: 'Deleted Successfully' });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });
    }
}


module.exports = {
    getTeachers, getStudents, remove
}
