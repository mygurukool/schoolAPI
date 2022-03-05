const express = require('express');
const verify = require('../middlewares/verifyToken');
const { assignmentController } = require('../controllers')
const router = express.Router();
const upload = require('../multer');

router.get('/', verify, assignmentController.all)
router.post('/create', verify, upload.any(), assignmentController.create)
router.put('/edit', verify, upload.any(), assignmentController.update)
router.delete('/delete', verify, assignmentController.remove)
router.get('/submissions', verify, assignmentController.submissions)
router.post('/submissions/point', verify, assignmentController.submissionsPoint)
router.delete('/exercisefile', verify, assignmentController.deleteExcercise)
router.get('/files', verify, assignmentController.getFiles)


module.exports = router;
