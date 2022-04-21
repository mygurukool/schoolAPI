const catchAsync = require("../utils/catchAsync");
const { contactService } = require("../services");

const submitDetails = catchAsync(async (req, res) => {
  const result = await contactService.submitDetails(req.body);
  return res.status(result.status).send(result);
});

module.exports = {
  submitDetails,
};
