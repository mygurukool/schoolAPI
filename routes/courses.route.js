const express = require('express');
const { coursesController } = require('../controllers')
const router = express.Router();
const verify = require('../middlewares/verifyToken')

router.get('/', verify, coursesController.all)
router.post('/create', verify, coursesController.create)
router.put('/edit', verify, coursesController.update)
router.delete('/delete', verify, coursesController.remove)
router.get('/assignments', coursesController.assignmentList)

module.exports = router;
