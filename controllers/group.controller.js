const catchAsync = require('../utils/catchAsync');
const { groupService } = require('../services');

const all = catchAsync(async (req, res) => {
    const result = await groupService.all(req);
    return res.status(result.status).send(result);
});

const create = catchAsync(async (req, res) => {
    const result = await groupService.create(req.body);
    return res.status(result.status).send(result);
});

const update = catchAsync(async (req, res) => {
    const result = await groupService.update(req.body);
    return res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
    const result = await groupService.remove(req.body);
    return res.status(result.status).send(result);
});

module.exports = {
    all, create, update, remove
};