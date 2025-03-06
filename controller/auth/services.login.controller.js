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
    const FoundService = await pool_connection.query(
      "SELECT * FROM services WHERE service = ?",
      [service]
    );
    const FoundServiceRegisteredAccounts = await pool_connection.query(
      "SELECT * FROM users WHERE service_provider = ?",
      [FoundService[0][0]?.service_id]
    );
    const PasswordMatch = await bcrypt.compare(
      `${JSON.stringify(request.body?.service_password)}`,
      FoundService[0][0]?.service_password
    );

        if (!service || !service_password) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service name and service_password are all required!"
            });
        } else if (!FoundService) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service does not exist!"
            });
        } else if (!PasswordMatch || PasswordMatch === false) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service password is incorrect!"
            });
        } else {
            const token = jwt.sign({
                service: service,
                service_id: FoundService[0][0].service_id,
                service_created: format(new Date(), "yyyy-MM-dd HH:mm:ss")
            }, process.env.REFRESH_TOKEN_SECRETE_KEY, {
                expiresIn: "1h"
            });

            await mailer(FoundService[0][0]?.service_owner_email, " Web Authentication Service Login", FoundService[0][0]?.service);

            return response.status(200).jsonp({
                message: "service logged in successfully!",
                data: {
                    service: service,
                    service_id: FoundService[0][0]?.service_id,
                    login_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    api_key: token,
                    owner: FoundService[0][0]?.service_owner,
                    owner_email: FoundService[0][0]?.service_owner_email,
                    service_description: FoundService[0][0]?.description,
                    accounts: FoundServiceRegisteredAccounts[0].length,
                    project: FoundService[0][0]?.project_name
                }
            });
        }
    } catch (error) {
        console.log(error);
        return response.status(404).jsonp({
            message: "bad request",
            error: "no such service was found!"
        });
    }
};
