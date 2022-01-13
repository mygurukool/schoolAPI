const httpStatus = require('http-status');
const { axiosMiddleware } = require('../middlewares/axios');
const { Course } = require('../models');
const { courseApis } = require('../utils/gapis');


const all = async (req) => {
    try {
        if (req.loginType === 'mygurukool') {
            const courses = await Course.find(req.query)
            return ({ status: httpStatus.OK, data: courses });
        } else if (req.loginType === 'google') {
            const courses = await axiosMiddleware({ url: courseApis.getCourses() }, req)
            const newCourse = await Promise.all(courses.courses.map(c => {
                return { ...c, courseName: c.name }
            }))

            return ({ status: httpStatus.OK, data: newCourse });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}


const create = async (req) => {
    try {
        const data = req.body
        if (req.loginType === 'mygurukool') {
            const checkIfExist = await Course.findOne(data)
            if (checkIfExist) {
                return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Group name already exist" });
            }
            await Course.create(data)
            return ({ status: httpStatus.OK, message: "Course created successfully" });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const update = async (req) => {
    try {
        const data = req.body
        if (req.loginType === 'mygurukool') {
            const checkIfExist = await Course.findOne({ courseName: data.courseName, organizationId: data.organizationId })
            if (checkIfExist && checkIfExist.courseName != data.courseName) {
                const check = Course.find({ courseName: data.courseName, _id: data.id || data.id })
                if (check.length > 0) {
                    return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Course name already exist!" })
                }
            }
            await Course.findByIdAndUpdate(data.id || data._id, data)
            return ({ status: httpStatus.OK, message: "Course updated successfully" });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const remove = async (req) => {
    try {
        const data = req.body
        if (req.loginType === 'mygurukool') {
            await Course.findByIdAndDelete(data.id || data._id)
            return ({ status: httpStatus.OK, message: "Course deleted successfully" });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const assignmentList = async (req) => {
    try {
        const { courseId } = req.query
        const assignments = await axiosMiddleware({ url: courseApis.getAssignments(courseId) }, req)
        const courseTeachers = await axiosMiddleware({ url: courseApis.getCourseTeachers(courseId) }, req)
        const courseStudents = await axiosMiddleware({ url: courseApis.getCourseStudents(courseId) }, req)
        const teachers = await Promise.all(courseTeachers.teachers.map(t => {
            return { courseId: t.courseId, teacherId: t.userId, name: t.profile.name.fullName, permissions: t.profile.permissions }
        }))
        const students = await Promise.all(courseStudents.students.map(t => {
            return { courseId: t.courseId, studentId: t.userId, name: t.profile.name.fullName, permissions: t.profile.permissions }
        }))
        // console.log('courseTeachers', students);
        return ({ status: httpStatus.OK, data: { assignments: assignments.courseWork, teachers: teachers, students: students } });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}


module.exports = {
    all, create, update, remove, assignmentList
}
