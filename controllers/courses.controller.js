const catchAsync = require("../utils/catchAsync");
const { coursesService } = require("../services");

const all = catchAsync(async (req, res) => {
  const result = await coursesService.all(req);
  return res.status(result.status).send(result);
});

const create = catchAsync(async (req, res) => {
  const result = await coursesService.create(req);
  console.log("create", await result);
  return res.status(result.status).send(result);
});

const update = catchAsync(async (req, res) => {
  const result = await coursesService.update(req);
  return res.status(result.status).send(result);
});

const remove = catchAsync(async (req, res) => {
  const result = await coursesService.remove(req);
  return res.status(result.status).send(result);
});

const assignmentList = catchAsync(async (req, res) => {
  const result = await coursesService.assignmentList(req);
  return res.status(result.status).send(result);
});

module.exports = {
  all,
  create,
  update,
  remove,
  assignmentList,
};
