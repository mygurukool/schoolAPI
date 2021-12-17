const express = require('express');
const { chatController } = require('../controllers')
const router = express.Router();

router.get('/usergroups', chatController.userGroups)

module.exports = router;
