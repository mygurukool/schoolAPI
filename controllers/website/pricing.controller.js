const catchAsync = require("../../utils/catchAsync");
const { pricingService } = require("../../services/website");

const all = catchAsync(async (req, res) => {
  const result = await pricingService.all(req.body);
  return res.status(result.status).send(result);
});

module.exports = {
  all,
};
