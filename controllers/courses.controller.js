const catchAsync = require('../utils/catchAsync');
const { coursesService } = require('../services');

const all = catchAsync(async (req, res) => {
    const result = await coursesService.all(req);
    return res.status(result.status).send(result)
})

const assignmentList = catchAsync(async (req, res) => {
    const result = await coursesService.assignmentList(req);
    return res.status(result.status).send(result)
})

module.exports = {
    all, assignmentList
};