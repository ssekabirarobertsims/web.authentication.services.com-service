"use strict";
debugger;
const pool_connection = require("../../model/connection/model.connection");
const bcrypt = require("bcrypt");
require("dotenv").config();
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
    const PasswordMatch = await bcrypt.compare(
      `${JSON.stringify(request.body?.service_password)}`,
      FoundService[0][0]?.service_password
    );

    if (!service || !service_password) {
      return response.status(400).jsonp({
        error: "bad request",
        message: "service name and service_password are all required!",
      });
    } else if (!FoundService) {
      return response.status(400).jsonp({
        error: "bad request",
        message: "service does not exist in database!",
      });
    } else if (!PasswordMatch || PasswordMatch === false) {
      return response.status(400).jsonp({
        error: "bad request",
        message: "service password is incorrect!",
      });
    } else {
      return response.status(200).jsonp({
        message: "service log out was successfully!",
        logout_date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        data: {
          service: service,
          service_id: FoundService[0][0]?.service_id,
          owner: FoundService[0][0]?.service_owner,
          owner_email: FoundService[0][0]?.service_owner_email,
          service_description: FoundService[0][0]?.description,
          project: FoundService[0][0]?.project_name,
        },
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(404).jsonp({
      error: "bad request",
      message: "no such service was found in database!",
    });
  }
};
