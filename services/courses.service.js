const { default: axios } = require('axios');
const httpStatus = require('http-status');
const { axiosMiddleware } = require('../middlewares/axios');
const { courseApis } = require('../utils/gapis');


const all = async (req) => {
    try {
        const courses = await axiosMiddleware({ url: courseApis.getCourses() }, req)
        let groups = []
        await Promise.all(courses.courses.map(c => {
            groups.push(c.section)
        }))
        return ({ status: httpStatus.OK, data: { courses: courses.courses, groups: groups } });
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
    all, assignmentList
}
