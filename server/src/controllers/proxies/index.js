const fetchAllProxies = require("./getAll");
const addProxies = require("./add");
const updateProxy = require("./update");
const deleteProxies = require("./delete");
const checkProxies = require("./check");

const express = require("express");
const router = express.Router();

router.get("/", fetchAllProxies);
router.post("/", addProxies);
router.put("/:id", updateProxy);
router.delete("/", deleteProxies);
router.post("/check", checkProxies);

module.exports = router;
