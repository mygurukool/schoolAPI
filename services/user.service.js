const httpStatus = require('http-status');
const { ObjectId } = require('mongodb');
const { axiosMiddleware } = require('../middlewares/axios');
const { Group, User, UploadFile } = require('../models');
const { courseApis } = require('../utils/gapis');

const getTeachers = async (req) => {
    try {
        if (req.loginType === 'mygurukool') {
            const teachers = await Group.findById(req.query.groupId)
            return ({ status: httpStatus.OK, data: teachers.teachers });
        } else if (req.loginType === 'google') {
            const courseTeachers = await axiosMiddleware({ url: courseApis.getCourseTeachers(req.query.courseId) }, req)
            const teachers = await Promise.all(courseTeachers.teachers.map(t => {
                return { courseId: t.courseId, teacherId: t.userId, name: t.profile.name.fullName, permissions: t.profile.permissions }
            }))
            console.log('teachers', courseTeachers);
            return ({ status: httpStatus.OK, data: teachers });
        }

    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });

    }
}

const getStudents = async (req) => {
    try {
        // console.log('req', req.loginType, req.query);
        if (req.loginType === 'mygurukool') {
            const students = await Group.findById(req.query.groupId)
            // console.log('students', students);
            return ({ status: httpStatus.OK, data: students.students });
        } else if (req.loginType === 'google') {
            const courseStudents = await axiosMiddleware({ url: courseApis.getCourseStudents(req.query.courseId) }, req)
            const students = await Promise.all(courseStudents.students.map(t => {
                return { courseId: t.courseId, studentId: t.userId, name: t.profile.name.fullName, permissions: t.profile.permissions }
            }))
            return ({ status: httpStatus.OK, data: students });
        }
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


const uploadFile = async (req) => {
    try {
        const userId = req.userId
        await UploadFile.create({ ...req.body, studentId: userId, file: req.files[0] })
        return ({ status: httpStatus.OK, message: 'File Uploaded Successfully' });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });
    }
}

const deleteFile = async (id) => {
    try {
        await UploadFile.findByIdAndDelete(id)
        return ({ status: httpStatus.OK, message: 'File Deleted Successfully' });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create organization" });
    }
}

module.exports = {
    getTeachers, getStudents, remove, uploadFile, deleteFile
}
