const express = require('express');
const { utilController } = require('../controllers')
const router = express.Router();

router.get('/file/:type/:id', utilController.getImage)
router.post('/metadata', utilController.getMetadata)

module.exports = router;
