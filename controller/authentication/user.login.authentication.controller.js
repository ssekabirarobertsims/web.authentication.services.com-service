"use strict";
debugger;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool_connection = require("../../model/connection/model.connection");
const { v4: uuid } = require("uuid");
const validator = require("validator");
require("dotenv").config();
const mailer = require("../middleware/mail/user.login.mail.middleware.controller");
const format = require("date-fns").format;

module.exports = async function (request, response) {
  const { email, password } = request.body;

  try {
    // check for existing user email in the database
    const FoundUserInDb = await pool_connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // check for existing user password if match with sent one to server
    const PasswordMatch = await bcrypt.compare(
      `${JSON.stringify(password)}`,
      FoundUserInDb[0][0]?.password
    );

    // create new token using user credentials
    const token = jwt.sign(
      {
        user_account_id: FoundUserInDb[0][0]?.account_id
          ? FoundUserInDb[0][0]?.account_id
          : "undefined",
        email: FoundUserInDb[0][0]?.email
          ? FoundUserInDb[0][0]?.email
          : "undefined",
        username: FoundUserInDb[0][0]?.username
          ? FoundUserInDb[0][0]?.username
          : "undefined",
      },
      process.env.REFRESH_TOKEN_SECRETE_KEY,
      { expiresIn: "2d" }
    );

    if (
      !email ||
      typeof email === "undefined" ||
      !password ||
      typeof password === "undefined"
    ) {
      return response.status(400).jsonp({
        message: "Email and password are required!",
        error: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!validator.isEmail(email)) {
      return response.status(400).jsonp({
        message: "Email is invalid!",
        error: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!PasswordMatch || PasswordMatch === false) {
      return response.status(400).jsonp({
        error: "Bad request",
        message: "Password is incorrect!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (
      !FoundUserInDb[0][0]?.length < 1 ||
      !FoundUserInDb[0][0]?.email === email
    ) {
      return response.status(400).jsonp({
        error: "Bad request",
        message: "User with email does not exist in our databases!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!validator.isEmail(email)) {
      return response.status(400).jsonp({
        error: "Bad request",
        message: "Email is invalid!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else {
      await mailer(email, "User Account Login", FoundUserInDb[0][0]?.username);

      return response.status(200).jsonp({
        message: "User logged in successfully!",
        data: {
          token: token,
          login_id: uuid(),
          account_id: FoundUserInDb[0][0]?.account_id,
          email: FoundUserInDb[0][0]?.email,
          username: FoundUserInDb[0][0]?.username,
        },
        status_code: (response.statusCode = Number(parseInt(200))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
        platform: "Web Authentication Services",
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).jsonp({
      error: "Bad request",
      status_code: (response.statusCode = Number(parseInt(500))),
      request_id: uuid(),
      date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      message: "User with email does not exist in our databases!",
    });
  }
};
