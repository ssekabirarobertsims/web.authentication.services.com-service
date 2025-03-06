"use strict";
debugger;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool_connection = require("../../model/connection/model.connection");
const { v4: uuid } = require("uuid");
const validator = require("validator");
require("dotenv").config();
const mailer = require("../middleware/mail/signup.mail.middleware.controller");
const format = require("date-fns").format;

module.exports = async function (request, response) {
  const { username, email, password, service_provider } = request.body;

  try {
    const FoundUser = await pool_connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(`${JSON.stringify(password)}`, salt);
    const FoundServiceProvider = await pool_connection.query(
      `
                SELECT * FROM services WHERE service_id = ?
            `,
      [service_provider]
    );

    if (!username || !email || !password || !service_provider) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "username, email, service_provider and password are required",
      });
    } else if (!validator.isEmail(email)) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "email is invalid!",
      });
    } else if (password.length < 8) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "password must be at least 8 characters or more!",
      });
    } else if (!validator.isStrongPassword(password)) {
      return response.status(400).jsonp({
        message: "bad request",
        error:
          "password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol!",
      });
    } else if (username.length < 4) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "username must be at least 4 characters or more!",
      });
    } else if (username.length > 20) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "username must be at most 20 characters or less!",
      });
    } else if (
      FoundUser[0][0]?.length > 0 ||
      FoundUser[0][0]?.email === email
    ) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "email already exists or already in use!",
      });
    } else if (!FoundServiceProvider[0][0]) {
      return response.status(400).jsonp({
        message: "bad request",
        error: "service provider does not exist!",
      });
    } else {
      await pool_connection.query(
        "INSERT INTO users (account_id, username, email, password, _date, service_provider) VALUES (?, ?, ?, ?, ?, ?)",
        [
          uuid(),
          username,
          email,
          hash,
          format(new Date(), "yyyy-MM-dd"),
          service_provider,
        ]
      );
      await mailer(email, "Account Successfully Created! 🎉", username);
      response.status(201).jsonp({
        message: "User created successfully!",
        data: {
          username: username,
          email: email,
        },
        date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  } catch (error) {
    console.error(error);
    response.status(500).jsonp({
      message: "internal server error",
      error: error.message,
    });
  }
};
