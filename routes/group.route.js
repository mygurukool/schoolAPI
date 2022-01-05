const express = require('express');
const verify = require('../middlewares/verifyToken');
const { groupController } = require('../controllers')
const router = express.Router();

router.get('/', verify, groupController.all)
router.post('/create', verify, groupController.create)
router.put('/edit', verify, groupController.update)
router.delete('/delete', verify, groupController.remove)

module.exports = router;
