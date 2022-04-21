const express = require('express');
const router = express.Router();
const auth = require('./auth.route')
const organization = require('./organization.route')
const courses = require('./courses.route')
const chat = require('./chat.route')
const group = require('./group.route')
const assignment = require('./assignment.route')
const invitation = require('./invitation.route')
const user = require('./user.route');
const util = require('./util.route')
const events = require('./events.route')
const notification = require('./notification.route')
const contact = require('./contact.route')

router.use('/auth', auth)
router.use('/organization', organization)
router.use('/course', courses)
router.use('/chat', chat)
router.use('/group', group)
router.use('/assignment', assignment)
router.use('/invite', invitation)
router.use('/user', user)
router.use('/', util)
router.use('/events', events)
router.use('/notification', notification)
router.use('/contact', contact)

module.exports = router;