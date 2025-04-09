"use strict";
debugger;
const express = require("express");
const router = express.Router();

router.use(
  "/user/account/login",
  require("../middleware/jwt/jwt.middleware.controller"),
  require("../authentication/user.login.authentication.controller")
);

router.use(
  "/user/account/signup",
  require("../middleware/jwt/jwt.middleware.controller"),
  require("../authentication/user.signup.authentication.controller")
);

module.exports = router; 