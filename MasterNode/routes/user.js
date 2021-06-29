const express = require("express");
const router = express.Router();
const { CreateUser } = require('../controllers/userEntry');

router.post("/UserEntry", CreateUser);

module.exports = router;