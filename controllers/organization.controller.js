const catchAsync = require("../utils/catchAsync");
const { organizationService } = require("../services");

const create = catchAsync(async (req, res) => {
  const result = await organizationService.create(req.body);
  return res.status(result.status).send(result);
});

const changeUploadPermission = catchAsync(async (req, res) => {
  const result = await organizationService.changeUploadPermission(req.body);
  return res.status(result.status).send(result);
});

const checkUploadPermission = catchAsync(async (req, res) => {
  const result = await organizationService.checkUploadPermission(req.query);
  return res.status(result.status).send(result);
});
module.exports = {
  create,
  changeUploadPermission,
  checkUploadPermission,
};
