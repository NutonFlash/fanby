const express = require('express');
const checkServer = require('./server');
const checkDatabase = require('./database');

const router = express.Router();

router.post('/server', checkServer);
router.post('/database', checkDatabase);

module.exports = router;
