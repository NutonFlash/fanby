const express = require('express');
const getAllTwitterAccounts = require('./getAll');
const getTwitterAccountById = require('./getById');
const createTwitterAccount = require('./addOne');
const updateTwitterAccountById = require('./update');
const deleteTwitterAccounts = require('./delete');

const router = express.Router();

router.get('/', getAllTwitterAccounts);
router.get('/:id', getTwitterAccountById);
router.post('/', createTwitterAccount);
router.put('/:id', updateTwitterAccountById);
router.delete('/', deleteTwitterAccounts);

module.exports = router;
