const httpStatus = require('http-status');
const moment = require('moment');
const { axiosMiddleware } = require('../middlewares/axios');
const { Assignment } = require('../models');
const { DATETIMEFORMAT } = require('../utils/constants');
const { courseApis } = require('../utils/gapis');

const all = async (req) => {
    try {
        if (req.loginType === 'mygurukool') {
            const assignment = await Assignment.find(req.query)
            const newAssignment = await Promise.all(assignment.map(a => {
                return { ...a._doc, dueDate: moment(a.dueDate).format(DATETIMEFORMAT) }
            }))
            return ({ status: httpStatus.OK, data: { assignments: newAssignment } });
        } else if (req.loginType === 'google') {
            const { courseId } = req.query
            const assignments = await axiosMiddleware({ url: courseApis.getAssignments(courseId) }, req)

            const newAssignment = await Promise.all(assignments.courseWork.map(a => {
                return { ...a, assignmentTitle: a.title, instructions: a.description, dueDate: a.dueDate ? `${a.dueDate?.day}/${a.dueDate?.month}/${a.dueDate?.year} ${a.dueTime.hours}:${a.dueTime.minutes}  ` : '' }
            }))
            // console.log('courseTeachers', students);
            return ({ status: httpStatus.OK, data: { assignments: newAssignment, } });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const create = async (req) => {
    try {
        const audioVideo = JSON.parse(req.body.audioVideo)
        if (req.loginType === 'mygurukool') {
            await Assignment.create({ ...req.body, organizationId: req.organizationId, userId: req.userId, uploadExercises: req.files, audioVideo: audioVideo })
            return ({ status: httpStatus.OK, message: 'Assignment created successfully' });
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
            await Assignment.findByIdAndUpdate(data.id || data._id, data)
            return ({ status: httpStatus.OK, message: 'Assignment updated successfully' });
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
            await Assignment.findByIdAndDelete(data.id || data._id)
            return ({ status: httpStatus.OK, message: 'Assignment deleted successfully' });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}


module.exports = {
    all, create, update, remove
}
