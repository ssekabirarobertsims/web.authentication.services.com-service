"use strict";
debugger;
const pool_connection = require("../../model/connection/model.connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const validator = require("validator");
require("dotenv").config();
const mailer = require("../middleware/mail/service.login.middleware.controller");
const format = require("date-fns").format;

module.exports = async function (request, response) {
  response.contentType = "Application/json";
  response.statusCode = Number.parseInt(200);

  const { service, service_password } = request.body;

  try {
    // find corresponding service in db
    const FoundServiceInDb = await pool_connection.query(
      "SELECT * FROM services WHERE service = ?",
      [service]
    );

    // find user account created under service
    const FoundServiceInDbRegisteredAccounts = await pool_connection.query(
      "SELECT * FROM users WHERE service_provider = ?",
      [FoundServiceInDb[0][0]?.service_id]
    );

    // compare password with service in db and sent one in req
    const PasswordMatch = await bcrypt.compare(
      `${JSON.stringify(request.body?.service_password)}`,
      FoundServiceInDb[0][0]?.service_password
    );

    if (!service || !service_password) {
      return response.status(400).jsonp({
        error: "Bad request",
        message: "Service name and service password are all required!",
        status_code: (response.statusCode = Number(parseInt(400))),
                request_id: uuid(),
                date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!FoundServiceInDb) {
      return response.status(400).jsonp({
        error: "Bad request",
        message: "Sorry, such service does not exist in db!",
        status_code: (response.statusCode = Number(parseInt(400))),
                request_id: uuid(),
                date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!PasswordMatch || PasswordMatch === false) {
      return response.status(400).jsonp({
        error: "Bad request",
        message: "Provided service password is incorrect!",
        status_code: (response.statusCode = Number(parseInt(400))),
                request_id: uuid(),
                date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else {
      // create and sign new token for service
      const token = jwt.sign(
        {
          service: service,
          service_id: FoundServiceInDb[0][0].service_id,
          service_created: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        },
        process.env.REFRESH_TOKEN_SECRETE_KEY,
        {
          expiresIn: "2d",
        }
      ); 

      await mailer(
        FoundServiceInDb[0][0]?.service_owner,
        FoundServiceInDb[0][0]?.service_owner_email,
        "Web Authentication Service Login",
        FoundServiceInDb[0][0]?.service
      );

      return response.status(200).jsonp({
        message: "service logged in successfully!",
        data: {
          service: service,
          service_id: FoundServiceInDb[0][0]?.service_id,
          login_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          api_key: token,
          owner: FoundServiceInDb[0][0]?.service_owner,
          owner_email: FoundServiceInDb[0][0]?.service_owner_email,
          service_description: FoundServiceInDb[0][0]?.description,
          accounts: FoundServiceInDbRegisteredAccounts[0].length,
          project: FoundServiceInDb[0][0]?.project_name,
        },
        platform: "Web Authentication Services",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(404).jsonp({
      message: "Bad request",
      error: "No such service was found!",
      status_code: (response.statusCode = Number(parseInt(404))),
      request_id: uuid(),
      date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
    });
  }
};
