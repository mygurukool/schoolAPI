const express = require('express');
const verify = require('../middlewares/verifyToken');
const { eventsController } = require('../controllers')
const router = express.Router();

router.get('/', verify, eventsController.all)
router.post('/create', verify, eventsController.create)
router.put('/edit', verify, eventsController.update)
router.delete('/delete', verify, eventsController.remove)

module.exports = router;
