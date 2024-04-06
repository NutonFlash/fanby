const fetchAllAccounts = require("./getAll");
const addAccounts = require("./add");
const updateAccount = require("./update");
const deleteAccounts = require("./delete");

const express = require("express");
const router = express.Router();

router.get("/", fetchAllAccounts);
router.post("/", addAccounts);
router.put("/:id", updateAccount);
router.delete("/", deleteAccounts);

module.exports = router;
