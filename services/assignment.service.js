const httpStatus = require('http-status');
const moment = require('moment');
const { ObjectId } = require('mongodb');
const { axiosMiddleware } = require('../middlewares/axios');
const { Assignment, UploadFile, User, StudentPoint } = require('../models');
const { DATETIMEFORMAT } = require('../utils/constants');
const { courseApis } = require('../utils/gapis');

const all = async (req) => {
    try {
        if (req.loginType === 'mygurukool') {
            const assignment = await Assignment.find({ ...req.query, status: true })
            const newAssignment = await Promise.all(assignment.map(async a => {
                // console.log('userFiles', { assignmentId: ObjectId(a._id) || ObjectId(a.id), studentId: req.userId, });
                let uploadExercises = []
                if (a.uploadExercises.length > 0) {
                    uploadExercises = await Promise.all(a.uploadExercises.map(async exercise => {

                        const userFiles = await UploadFile.find({ assignmentId: ObjectId(a._id) || ObjectId(a.id), studentId: req.userId, fileId: exercise.id || exercise._id })

                        return { ...exercise, files: userFiles }
                    }))
                }
                else {
                    const userFiles = await UploadFile.find({ assignmentId: ObjectId(a._id) || ObjectId(a.id), studentId: req.userId, })

                    uploadExercises = [{ files: userFiles }]
                }
                return { ...a._doc, uploadExercises: uploadExercises, dueDate: moment(a.dueDate).format(DATETIMEFORMAT) }
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
        console.log('req.body', req.body);
        const audioVideo = req.body.audioVideo ? JSON.parse(req.body.audioVideo) : []
        const uploadExercises = req.body.uploadExercises ? JSON.parse(req.body.uploadExercises) : []

        const newExercise = await Promise.all(uploadExercises.map(u => {
            let id = new ObjectId()
            if (!u.id) {
                return { ...u, id: id }
            }
            return u
        }))

        if (req.loginType === 'mygurukool') {
            await Assignment.create({ ...req.body, organizationId: req.organizationId, userId: req.userId, uploadExercises: [...req.files, ...newExercise], audioVideo: audioVideo })
            return ({ status: httpStatus.OK, message: 'Assignment created successfully' });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: "Failed to create assignment" });
    }
}

const update = async (req) => {
    try {
        const data = req.body
        console.log('data', data, req.files);
        if (req.loginType === 'mygurukool') {
            const audioVideo = data.audioVideo ? JSON.parse(data.audioVideo) : []
            const uploadExercises = data.uploadExercises ? JSON.parse(data.uploadExercises) : []
            console.log('uploadExercises', uploadExercises);
            const newExercise = await Promise.all(uploadExercises.map(u => {
                let id = new ObjectId()
                console.log('yu', u);
                if (u) {
                    if (!u.id) {
                        return { ...u, id: id }
                    }
                    return u
                }
            }))
            console.log('newExercise', newExercise);
            const students = JSON.parse(data.students)
            delete data.uploadExercises
            await Assignment.findByIdAndUpdate(data.id || data._id, { ...data, students: students, organizationId: req.organizationId, audioVideo: audioVideo, $push: { uploadExercises: [...req.files, ...newExercise] } })
            return ({ status: httpStatus.OK, message: 'Assignment updated successfully' });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: 'Failed to updated assignment' });
    }
}

const remove = async (req) => {
    try {
        const data = req.body
        if (req.loginType === 'mygurukool') {
            // await Assignment.findByIdAndDelete(data.id || data._id)
            await Assignment.findByIdAndUpdate(data.id || data._id, { status: false })

            return ({ status: httpStatus.OK, message: 'Assignment deleted successfully' });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const submissions = async (req) => {
    try {
        const data = req.query
        if (req.loginType === 'mygurukool') {
            const assignment = await Assignment.findById(data.id || data._id)
            const studentFiles = await Promise.all(assignment.students.map(async s => {
                const student = await User.findById(s)
                const points = await StudentPoint.findOne({ assignmentId: data.id || data._id, studentId: s, })
                const files = await Promise.all(assignment.uploadExercises.map(async exercise => {
                    const userFiles = await UploadFile.find({ assignmentId: data.id || data._id, studentId: s, fileId: exercise.id || exercise._id })
                    return { ...exercise, files: userFiles }
                }))
                if (student)
                    return { id: student._id || student.id, name: student.name ? student.name : '', email: student.email ? student.email : '', uploadExercises: files || [], points: points ? points.points : null }
            }))
            return ({ status: httpStatus.OK, data: { ...assignment._doc, students: studentFiles }, });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const submissionsPoint = async (req) => {
    try {
        const data = req.body
        console.log(data);
        if (req.loginType === 'mygurukool') {
            await StudentPoint.create(data)
            return ({ status: httpStatus.OK, message: 'Points Added successfully' });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

const deleteExcercise = async (req) => {
    try {
        const data = req.body
        if (req.loginType === 'mygurukool') {
            console.log('req', req.body);
            await Assignment.findByIdAndUpdate(data.assignmentId, { $pull: { uploadExercises: { id: ObjectId(req.body.id) } } })
            return ({ status: httpStatus.OK });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}


const getFiles = async (req) => {
    try {
        const data = req.query
        if (req.loginType === 'mygurukool') {
            console.log('req', req.body);
            const files = await UploadFile.find({ assignmentId: data.assignmentId, studentId: data.studentId })
            return ({ status: httpStatus.OK, data: files });
        }
    } catch (error) {
        console.log(error);
        return ({ status: httpStatus.INTERNAL_SERVER_ERROR, message: error });
    }
}

module.exports = {
    all, create, update, remove, submissions, submissionsPoint, deleteExcercise, getFiles
}
