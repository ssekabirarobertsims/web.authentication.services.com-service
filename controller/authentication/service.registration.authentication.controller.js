"use strict";
debugger;
const pool_connection = require("../../model/connection/model.connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const validator = require("validator");
require("dotenv").config();
const mailer = require("../middleware/mail/service.signup.mail.middleware.controller");
const format = require("date-fns").format;

module.exports = async function (request, response) {
  response.contentType = "Application/json";
  response.statusCode = Number.parseInt(201);
  const { service, owner_username, owner_email, service_password, project } =
    request.body;

  try {
    const FoundService = await pool_connection.query(
      "SELECT * FROM services WHERE service = ?",
      [service]
    );
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(`${JSON.stringify(service_password)}`, salt);

    if (
      !service ||
      !owner_username ||
      !owner_email ||
      !service_password ||
      !project
    ) {
      return response.status(400).jsonp({
        message: "Bad request",
        error:
          "service, owner_username, owner_email, service_password and project are all required!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (!validator.isEmail(owner_email)) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Provided service owner email is invalid!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (service.length < 4) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "service name must be at least 4 characters or more!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (service.length > 20) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Provided service name must be at most 20 characters or less!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (owner_username.length < 4) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Provided owner username must be at least 4 characters or more!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (owner_username.length > 20) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Provided owner username must be at most 20 characters or less!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (project.length < 4) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Provided project name must be at least 4 characters or more!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (project.length > 20) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Provided project name must be at most 20 characters or less!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else if (
      FoundService[0][0]?.length > 0 ||
      FoundService[0][0]?.service === service
    ) {
      return response.status(400).jsonp({
        message: "Bad request",
        error: "Service already exists in our databases!",
        status_code: (response.statusCode = Number(parseInt(400))),
        request_id: uuid(),
        date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
      });
    } else {
      const description = "sample description";

      await pool_connection.query(
        "INSERT INTO services (service_id, service, service_password, service_owner, service_owner_email, description, project_name, _date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          uuid(),
          service,
          hash,
          owner_username,
          owner_email,
          String(description).toLocaleLowerCase(),
          project,
          format(new Date(), "yyyy-MM-dd"),
        ]
      );
      //
      await mailer(
        owner_email,
        "Web Authentication Service Signup",
        service,
        owner_username
      );
      //
      return response.status(201).jsonp({
        message: "Service created successfully!",
        data: {
          service: service,
          owner_username: owner_username,
          owner_email: owner_email,
          project: project,
          description: String(description).toLocaleLowerCase(),
        },
        date: format(new Date(), "yyyy-MM-dd"),
        status_code: (response.statusCode = Number(parseInt(201))),
        request_id: uuid(),
        platform: "Web Authentication Services",
      });
    }
  } catch (error) {
    console.log(error);
    return response.status(Number.parseInt(500)).json({
      error: "Internal Server Error",
      message: "Error while creating service!",
      status_code: (response.statusCode = Number(parseInt(500))),
      request_id: uuid(),
      date: format(new Date(), "yyyy-MM-dd\tHH:mm:ss"),
    });
  }
};
