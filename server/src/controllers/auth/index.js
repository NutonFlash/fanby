const express = require('express');
const login = require('./login');
const register = require('./register');
const refresh = require('./refresh');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);

module.exports = router;
