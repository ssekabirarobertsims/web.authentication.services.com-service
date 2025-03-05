"use strict";
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
        const FoundUser = await pool_connection.query("SELECT * FROM users WHERE email = ?", [email]);
        const PasswordMatch = await bcrypt.compare(`${JSON.stringify(password)}`, FoundUser[0][0]?.password);
        const token = jwt.sign({ email: email }, process.env.REFRESH_TOKEN_SECRETE_KEY, { expiresIn: "2d" });

        if (!email || !password) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "email and password are required"
            });
        } else if (!validator.isEmail(email)) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "email is invalid!"
            });
        } else if (!PasswordMatch || PasswordMatch === false) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "password is incorrect!"
            });
        } else if (!FoundUser[0][0]?.length < 1 || !FoundUser[0][0]?.email === email) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "user with email does not exist in our databases!"
            });
        } else {
            await mailer(email, "New Login Alert For Your Account!", FoundUser[0][0].username);

            response.status(200).jsonp({
                message: "User logged in successfully!",
                data: {
                    login_id: uuid(),
                    account_id: FoundUser[0][0]?.account_id,
                    email: FoundUser[0][0]?.email,
                    username: FoundUser[0][0]?.username,
                    token: token,
                },
                service_provider_platform: "Web Authentication Services",
                date: format(new Date(), "yyyy-MM-dd"),
            });
        }
    } catch (error) {
        console.error(error);
        return response.status(400).jsonp({
            message: "bad request",
            error: "user with email does not exist in our databases!"
        });
    }
}