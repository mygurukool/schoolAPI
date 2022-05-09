const express = require('express');
const { checkoutController } = require('../../controllers/website')
const router = express.Router();

router.post('/create-session', checkoutController.createSession)
router.get('/get-session', checkoutController.getSession)

module.exports = router;
