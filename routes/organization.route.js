const express = require('express');
const { organizationController } = require('../controllers')
const router = express.Router();

router.post('/create', organizationController.create)

module.exports = router;
