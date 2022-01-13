const express = require('express');
const verify = require('../middlewares/verifyToken')
const { userController } = require('../controllers')
const router = express.Router();

router.get('/teacher', verify, userController.getTeachers)
router.delete('/remove', verify, userController.remove)
router.get('/student', userController.getStudents)

module.exports = router;
