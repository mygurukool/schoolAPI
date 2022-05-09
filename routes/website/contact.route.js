const express = require('express');
const { contactController } = require('../../controllers/website')
const router = express.Router();

router.post('/submitdetails', contactController.submitDetails)

module.exports = router;
