const catchAsync = require("../../utils/catchAsync");
const { pricingService } = require("../../services/website");

const all = catchAsync(async (req, res) => {
  const result = await pricingService.all(req.query);
  return res.status(result.status).send(result);
});

const edit = catchAsync(async (req, res) => {
  const result = await pricingService.edit(req.body);
  return res.status(result.status).send(result);
});

module.exports = {
  all,
  edit
};
