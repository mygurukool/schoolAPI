const express = require('express');
const { pricingController } = require('../../controllers/website')
const router = express.Router();

router.get('/', pricingController.all)
router.post('/edit', pricingController.edit)

module.exports = router;
