const express = require('express');
const { invitationController } = require('../controllers')
const router = express.Router();

router.get('/', invitationController.getInvitation)
router.post('/send', invitationController.sendInvitation)
router.post('/accept', invitationController.acceptInvitation)

module.exports = router;
