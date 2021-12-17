const express = require('express');
const router = express.Router();
const auth = require('./auth.route')
const organization = require('./organization.route')
const courses = require('./courses.route')
const chat = require('./chat.route')

router.use('/auth', auth)
router.use('/organization', organization)
router.use('/course', courses)
router.use('/chat', chat)

module.exports = router;