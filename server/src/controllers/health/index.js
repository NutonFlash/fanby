const checkServer = require("./server");
const checkDatabase = require("./database");

const express = require("express");
const router = express.Router();

router.post("/server", checkServer);
router.post("/database", checkDatabase);

module.exports = router;
