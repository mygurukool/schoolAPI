const catchAsync = require('../utils/catchAsync');
const { utilService } = require('../services');

const getImage = catchAsync(async (req, res) => {
    return await utilService.getImage(req, res);
});

const getMetadata = catchAsync(async (req, res) => {
    const result = await utilService.getMetadata(req);
    return res.send(result);
});

module.exports = {
    getImage, getMetadata
};