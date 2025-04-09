"use strict";
debugger;
const jwt = require("jsonwebtoken");
const model_connection = require("../../../model/connection/model.connection");
require("dotenv").config();
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");

module.exports = async function (request, response, next) {
  try {
    const AuthorizationHeaders = request.headers["authorization"];
    const token = AuthorizationHeaders.split(" ")[1];
    const verifyToken = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRETE_KEY
    );

    if (jwt.decode(token) === null) {
      response.status(402).jsonp({
        error: "Invalid token provided!",
        message: "Unauthorized",
        status_code: (response.statusCode = Number(parseInt(402))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!token || !AuthorizationHeaders) {
      response.status(400).jsonp({
        error: "No token provided!",
        message: "Bad request",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else {
      next();
    }
  } catch (error) {
    response.status(400).jsonp({
      error: error.message,
      information: {
        data: "Token might be missing or invalid!",
      },
      message: "Bad request",
      status_code: (response.statusCode = Number(parseInt(400))),
      request_id: uuid(),
      date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
    });
    console.log(error);
  }
};
