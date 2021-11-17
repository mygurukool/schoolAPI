const express = require('express');
const router = express.Router();
const auth = require('./auth.route')
const organization = require('./organization.route')

router.use('/auth', auth)
router.use('/organization', organization)

module.exports = router;