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
  const { username, email, password, service_id } = request.body;

  try {
    // check for existing user email in the database
    const FoundUserEmailInDb = await pool_connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    // hash and salt the password for encryption
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(`${JSON.stringify(password)}`, salt);

    // check for existing service in the database
    const FoundServiceWithIdInDb = await pool_connection.query(
      `
                SELECT * FROM services WHERE service_id = ?
            `,
      [service_id]
    );

    if (
      !username ||
      typeof username === "undefined" ||
      !email ||
      typeof email === "undefined" ||
      !password ||
      !service_id ||
      typeof service_id === "undefined"
    ) {
      console.log("error 1")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Username, email, service_id and password are required!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!validator.isEmail(email)) {
      console.log("error 2")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Email is invalid!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (password.length < 8) {
      console.log("error 3")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Password must be at least 8 characters or more!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!validator.isStrongPassword(password)) {
      console.log("error 4")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error:
          "Password must contain at least 1 lowercase letter, 1 uppercase letter, 1 number and 1 symbol!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (username.length < 4) {
      console.log("error 5")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Username must be at least 4 characters or more!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (username.length > 20) {
      console.log("error 6")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Username must be at most 20 characters or less!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (
      FoundUserEmailInDb[0][0]?.length > 0 ||
      FoundUserEmailInDb[0][0]?.email === email
    ) {
      console.log("error 7")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Email already exists or already in use!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!FoundServiceWithIdInDb[0][0]) {
      console.log("error 8")

      return response.status(400).jsonp({
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        error: "Service provider does not exist in db!",
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
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
          service_id,
        ]
      );

      await mailer(email, "User Account Signup", username);

      return response.status(201).jsonp({
        message: "User has been created successfully!",
        data: {
          username: username,
          email: email,
        },
        status_code: (response.statusCode = Number(parseInt(201))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
        service_id: FoundServiceWithIdInDb[0][0]?.service_id
          ? FoundServiceWithIdInDb[0][0]?.service_id
          : "undefined",
        platform: "Web Authentication Services",
      });
    } 
  } catch (error) {
    console.error(error);
    response.status(500).jsonp({
      message: "internal server error",
      status_code: (response.statusCode = Number(parseInt(500))),
                          request_id: uuid(),
                          date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      error: error.message,
    });
  }
};
