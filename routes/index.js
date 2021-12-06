const express = require('express');
const router = express.Router();
const auth = require('./auth.route')
const organization = require('./organization.route')
const courses = require('./courses.route')

router.use('/auth', auth)
router.use('/organization', organization)
router.use('/course', courses)

module.exports = router;