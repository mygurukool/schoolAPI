const express = require('express');
const verify = require('../middlewares/verifyToken')
const { userController } = require('../controllers')
const router = express.Router();
const upload = require('../multer')

router.get('/teacher', verify, userController.getTeachers)
router.delete('/remove', verify, userController.remove)
router.get('/student', verify, userController.getStudents)
router.post('/student/uploadfile', verify, upload.any(), userController.uploadFile)
router.delete('/student/deletefile', verify, userController.deleteFile)

module.exports = router;
