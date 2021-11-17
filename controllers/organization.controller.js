const catchAsync = require('../utils/catchAsync');
const { organizationService } = require('../services');

const create = catchAsync(async (req, res) => {
    const result = await organizationService.create(req.body);
    return res.status(result.status).send(result);
});


module.exports = {
    create
};