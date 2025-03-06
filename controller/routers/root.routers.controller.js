"use strict";
debugger;
const express = require("express");
const router = express.Router();

router.use("/user/account/login", require("../middleware/jwt/jwt.middleware.controller"), require("../auth/login.auth.controller"));
router.use("/user/account/signup", require("../middleware/jwt/jwt.middleware.controller"), require("../auth/signup.auth.controller"));

module.exports = router; 