const express = require('express');
const getAllProxies = require('./getAll');
const createProxies = require('./addMany');
const updateProxy = require('./update');
const deleteProxies = require('./delete');
const checkProxies = require('./check');

const router = express.Router();

router.get('/', getAllProxies);
router.post('/', createProxies);
router.put('/:id', updateProxy);
router.delete('/', deleteProxies);
router.post('/check', checkProxies);

module.exports = router;
