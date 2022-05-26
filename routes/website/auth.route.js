const express = require('express');
const { auth } = require('../../controllers/website')
const verify = require('../../middlewares/verifyToken')
const router = express.Router();

router.post('/login', auth.login)
router.post('/register', auth.register)
router.post('/register-admin', auth.registerAdmin)
router.post('/update', auth.update)
router.get('/details', auth.details)

module.exports = router;
