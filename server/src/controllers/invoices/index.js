const express = require('express');
const createInvoice = require('./add');
const updateInvoice = require('./update');
const getAllInvoices = require('./getAll');
const { authorizeToken } = require('../utils');

const router = express.Router();

router.get('/', authorizeToken, getAllInvoices);
router.post('/', authorizeToken, createInvoice);
router.post('/update', updateInvoice);

module.exports = router;
