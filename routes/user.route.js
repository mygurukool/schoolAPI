const express = require('express');
const { userController } = require('../controllers')
const router = express.Router();

router.get('/teacher', userController.getTeachers)
router.delete('/remove', userController.remove)
router.get('/student', userController.getStudents)

module.exports = router;
