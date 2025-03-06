"use strict";
debugger;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool_connection = require("../../model/connection/model.connection");
const { v4: uuid } = require("uuid");
const validator = require("validator");
require("dotenv").config();
const mailer = require("../middleware/mail/login.mail.middleware.controller");
const format = require("date-fns").format;
 
module.exports = async function (request, response) {
  const { email, password } = request.body;

  try {
    const FoundUser = await pool_connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    const PasswordMatch = await bcrypt.compare(
      `${JSON.stringify(password)}`,
      FoundUser[0][0]?.password
    );
    const token = jwt.sign(
      { email: email },
      process.env.REFRESH_TOKEN_SECRETE_KEY,
      { expiresIn: "2d" }
    );

        if (!email || !password) {
            return response.status(400).jsonp({
                error: "bad request",
                message: "email and password are required"
            });
        } else if (!validator.isEmail(email)) {
            return response.status(400).jsonp({
                error: "bad request",
                message: "email is invalid!"
            });
        } else if (!PasswordMatch || PasswordMatch === false) {
            return response.status(400).jsonp({
                error: "bad request",
                message: "password is incorrect!"
            });
        } else if (!FoundUser[0][0]?.length < 1 || !FoundUser[0][0]?.email === email) {
            return response.status(400).jsonp({
                error: "bad request",
                message: "user with email does not exist in our databases!"
            });
        } else {
            await mailer(email, "New Login Alert for Your Account!", FoundUser[0][0].username);

            response.status(201).jsonp({
                message: "User logged in successfully!",
                data: {
                    token: token,
                    login_id: uuid(),
                    account_id: FoundUser[0][0]?.account_id,
                    email: FoundUser[0][0]?.email,
                },
                date: format(new Date(), "yyyy-MM-dd"),
                service_provider: "Web Authentication Service",
            });
        }
    } catch (error) {
        console.error(error);
        return response.status(400).jsonp({
            error: "bad request",
            message: "user with email does not exist in our databases!"
        });
    }
}