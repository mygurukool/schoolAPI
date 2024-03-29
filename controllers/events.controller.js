const catchAsync = require('../utils/catchAsync');
const { eventsService } = require('../services');

const all = catchAsync(async (req, res) => {
    const result = await eventsService.all(req);
    return res.status(result.status).send(result);
});

const create = catchAsync(async (req, res) => {
    const result = await eventsService.create(req);
    return res.status(result.status).send(result);
});

const update = catchAsync(async (req, res) => {
    const result = await eventsService.update(req.body);
    return res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
    const result = await eventsService.remove(req.body);
    return res.status(result.status).send(result);
});

const changeStatus = catchAsync(async (req, res) => {
    const result = await eventsService.changeStatus(req);
    return res.status(result.status).send(result);
});

module.exports = {
    all, create, update, remove, changeStatus
};