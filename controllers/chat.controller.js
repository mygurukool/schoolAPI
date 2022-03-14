const catchAsync = require("../utils/catchAsync");
const { chatService } = require("../services");

const userGroups = catchAsync(async (req, res) => {
  const result = await chatService.userGroups(req.query);
  return res.status(result.status).send(result);
});

module.exports = {
  userGroups,
};
