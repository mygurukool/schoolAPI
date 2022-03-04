const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getTeachers = catchAsync(async (req, res) => {
    const result = await userService.getTeachers(req);
    return res.status(result.status).send(result);
});

const getStudents = catchAsync(async (req, res) => {
    const result = await userService.getStudents(req);
    return res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
    const result = await userService.remove(req.query);
    return res.status(result.status).send(result);
});


const uploadFile = catchAsync(async (req, res) => {
    const result = await userService.uploadFile(req);
    return res.status(result.status).send(result);
});

const deleteFile = catchAsync(async (req, res) => {
    const result = await userService.deleteFile(req.query, req.userId);
    return res.status(result.status).send(result);
});


module.exports = {
    getTeachers, getStudents, remove, uploadFile, deleteFile
};