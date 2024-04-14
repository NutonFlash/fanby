const express = require('express');
const getAllActivationPrices = require('./getAll');

const router = express.Router();

router.get('/', getAllActivationPrices);

module.exports = router;
