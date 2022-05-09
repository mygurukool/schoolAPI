const catchAsync = require("../../utils/catchAsync");
const { checkoutService } = require("../../services/website");
// const stripe = require('stripe')('sk_test_51KtTAHLc3eJQjdiTQUSmmXcD9wqggIMR0R8fj8v55iiQMLwSCc8JXkgBJypCDKvObNTuqTFT2Pbau1rwvHK1sYtL00pPhoWSk4');
const createSession = catchAsync(async (req, res) => {

  const result = await checkoutService.createSession(req.body);
  return res.status(result.status).send(result);
  // const YOUR_DOMAIN = 'http://localhost:3000/en/register';
  // const session = await stripe.checkout.sessions.create({
  //   line_items: [
  //     {
  //       // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
  //       price: 'price_1KtouxLc3eJQjdiTtgqBZMJC',
  //       quantity: 1,
  //     },
  //   ],
  //   mode: 'payment',
  //   success_url: `${YOUR_DOMAIN}?success=true`,
  //   cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  // });
  // console.log('session.url', session);
  // res.redirect(303, session.url);

});

const getSession = catchAsync(async (req, res) => {
  const result = await checkoutService.getSession(req.query);
  return res.status(result.status).send(result);
});

module.exports = {
  createSession,
  getSession
};
