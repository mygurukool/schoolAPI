const catchAsync = require("../../utils/catchAsync");
const { checkoutService } = require("../../services/website");

const createSession = catchAsync(async (req, res) => {
  const result = await checkoutService.createSession(req.body);
  return res.status(result.status).send(result);
});

const getSession = catchAsync(async (req, res) => {
  const result = await checkoutService.getSession(req.query);
  return res.status(result.status).send(result);
});

const createSponsorSession = catchAsync(async (req, res) => {
  const result = await checkoutService.createSponsorSession(req.body);
  return res.status(result.status).send(result);
});

const createSponsor = catchAsync(async (req, res) => {
  const result = await checkoutService.createSponsor(req.body);
  return res.status(result.status).send(result);
});

module.exports = {
  createSession,
  getSession,
  createSponsorSession,
  createSponsor
};
