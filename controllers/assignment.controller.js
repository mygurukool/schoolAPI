const catchAsync = require('../utils/catchAsync');
const { assignmentService } = require('../services');

const all = catchAsync(async (req, res) => {
    const result = await assignmentService.all(req);
    return res.status(result.status).send(result);
});

const create = catchAsync(async (req, res) => {
    const result = await assignmentService.create(req);
    return res.status(result.status).send(result);
});

const update = catchAsync(async (req, res) => {
    const result = await assignmentService.update(req);
    return res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
    const result = await assignmentService.remove(req);
    return res.status(result.status).send(result);
});

const submissions = catchAsync(async (req, res) => {
    const result = await assignmentService.submissions(req);
    return res.status(result.status).send(result);
});

const submissionsPoint = catchAsync(async (req, res) => {
    const result = await assignmentService.submissionsPoint(req);
    return res.status(result.status).send(result);
});

const deleteExcercise = catchAsync(async (req, res) => {
    const result = await assignmentService.deleteExcercise(req);
    return res.status(result.status).send(result);
});

module.exports = {
    all, create, update, remove, submissions, submissionsPoint, deleteExcercise
};