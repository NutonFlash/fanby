const invoicesRouter = require("./controllers/invoices");
const authRouter = require("./controllers/auth");
const accountsRouter = require("./controllers/accounts");
const proxiesRouter = require("./controllers/proxies");
const healthRouter = require("./controllers/health");
const userRouter = require("./controllers/user");

const { authorizeToken } = require("./controllers/auth/utils");
const express = require("express");
const router = express.Router();

router.use("/invoices", invoicesRouter);
router.use("/auth", authRouter);
router.use("/health", healthRouter);
router.use("/accounts", authorizeToken, accountsRouter);
router.use("/proxies", authorizeToken, proxiesRouter);
router.use("/user", authorizeToken, userRouter);

module.exports = router;
