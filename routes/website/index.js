const express = require('express');
const checkout = require('./checkout.route');
const router = express.Router();
const auth = require('./auth.route')
const contact = require('./contact.route')
const pricing = require('./pricing.route')

router.use('/auth', auth)
router.use('/contact', contact)
router.use('/pricing', pricing)
router.use('/checkout', checkout)

module.exports = router;