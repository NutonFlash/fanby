const express = require('express');
const invoicesRouter = require('./controllers/invoices');
const authRouter = require('./controllers/auth');
const twitterAccountsRouter = require('./controllers/twitter-accounts');
const proxiesRouter = require('./controllers/proxies');
const healthRouter = require('./controllers/health');
const userRouter = require('./controllers/user');
const activationPricesRouter = require('./controllers/activation-prices');

const { authorizeToken } = require('./controllers/utils');

const router = express.Router();

router.use('/invoices', invoicesRouter);
router.use('/auth', authRouter);
router.use('/health', healthRouter);
router.use('/twitter-accounts', authorizeToken, twitterAccountsRouter);
router.use('/proxies', authorizeToken, proxiesRouter);
router.use('/user', authorizeToken, userRouter);
router.use('/activation-prices', authorizeToken, activationPricesRouter);

module.exports = router;
