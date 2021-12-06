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
        return ({ status: httpStatus.OK, data: { assignments: assignments.courseWork } });
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}


module.exports = {
    all, assignmentList
}
