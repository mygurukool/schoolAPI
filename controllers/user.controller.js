const catchAsync = require('../utils/catchAsync');
const { userService } = require('../services');

const getTeachers = catchAsync(async (req, res) => {
    const result = await userService.getTeachers(req.query);
    return res.status(result.status).send(result);
});

const getStudents = catchAsync(async (req, res) => {
    const result = await userService.getStudents(req.query);
    return res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
    const result = await userService.remove(req.query.id);
    return res.status(result.status).send(result);
});


module.exports = {
    getTeachers, getStudents, remove
};