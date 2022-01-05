const express = require('express');
const verify = require('../middlewares/verifyToken');
const { assignmentController } = require('../controllers')
const router = express.Router();

router.get('/', verify, assignmentController.all)
router.post('/create', verify, assignmentController.create)
router.put('/edit', verify, assignmentController.update)
router.delete('/delete', verify, assignmentController.remove)

module.exports = router;
