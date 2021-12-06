const express = require('express');
const { coursesController } = require('../controllers')
const router = express.Router();

router.get('/', coursesController.all)
router.get('/assignments', coursesController.assignmentList)

module.exports = router;
