const express = require('express');
const getUserById = require('./getById');

const router = express.Router();

router.get('/', getUserById);

module.exports = router;
