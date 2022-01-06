const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const { Group, User } = require('../models');

const getTeachers = async (data) => {
    try {
        const teachers = await Group.findById(data.groupId)
        return ({ status: httpStatus.OK, data: teachers.teachers });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }
}

const getStudents = async (data) => {
    try {
        const students = await Group.findById(data.groupId)
        return ({ status: httpStatus.OK, data: students.students });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });
    }
}

const remove = async (data) => {
    try {
        await User.findByIdAndDelete(data.id)
        await Group.findByIdAndUpdate(data.groupId, { $pull: { users: data.id, teachers: { _id: ObjectId(data.id), }, students: { _id: ObjectId(data.id) } } })
        return ({ status: httpStatus.OK, message: 'Deleted Successfully' });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });
    }
}


module.exports = {
    getTeachers, getStudents, remove
}
