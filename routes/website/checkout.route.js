const express = require('express');
const { checkoutController } = require('../../controllers/website')
const router = express.Router();

router.post('/create-session', checkoutController.createSession)
router.post('/create-sponsor-session', checkoutController.createSponsorSession)
router.get('/get-session', checkoutController.getSession)
router.post('/create-sponsor', checkoutController.createSponsor)

module.exports = router;
