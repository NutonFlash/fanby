const createInvoice = require("./create");
const updateInvoice = require("./update");
const fetchAllInvoices = require("./getAll");
const { authorizeToken } = require("../auth/utils");

const express = require("express");
const router = express.Router();

router.get("/", authorizeToken, fetchAllInvoices);
router.post("/", authorizeToken, createInvoice);
router.post("/update", updateInvoice);

module.exports = router;
