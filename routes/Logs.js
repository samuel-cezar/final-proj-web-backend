const express = require('express');
const router = express.Router();
const logsController = require('../controllers/LogsController');

// GET /logs
router.get('/', logsController.index);

module.exports = router;