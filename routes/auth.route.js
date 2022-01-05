const express = require('express');
const { auth } = require('../controllers')
const verify = require('../middlewares/verifyToken')
const router = express.Router();

router.post('/login', auth.login)
router.get('/details', auth.details)
// router.post('/forgotPassword', auth.forgotPassword)

module.exports = router;
