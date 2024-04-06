const fetchUser = require("./get");

const express = require("express");
const router = express.Router();

router.get("/", fetchUser);

module.exports = router;
