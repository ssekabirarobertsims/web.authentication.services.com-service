"use strict";
debugger;
const jwt = require("jsonwebtoken");
const model_connection = require("../../../model/connection/model.connection");
require("dotenv").config();

module.exports = async function (request, response, next) {
    try {
        const AuthorizationHeaders = request.headers["authorization"];
        const token = AuthorizationHeaders.split(" ")[1];
        const verifyToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRETE_KEY);

        if (jwt.decode(token) === null) {
            response.status(402)
                .jsonp({
                    error: "Invalid token provided!",
                    message: "Unauthorized"
                });
        } else if (!token || !AuthorizationHeaders) {
            response.status(400)
                .jsonp({
                    error: "No token provided!",
                    message: "Bad request"
                });
        } else {
            next();
        }
    } catch (error) {
        response.status(400)
            .jsonp({
                error: error.message,
                information: {
                    data: "token might be missing or invalid!"
                },
                message: "Bad request"
            });
        console.log(error)
    }
}