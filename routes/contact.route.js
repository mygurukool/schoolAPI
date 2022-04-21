const express = require('express');
const { contactController } = require('../controllers')
const router = express.Router();

router.post('/submitdetails', contactController.submitDetails)

module.exports = router;
