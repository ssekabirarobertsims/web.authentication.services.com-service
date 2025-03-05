"use strict";
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
    const { service, owner_username, owner_email, service_password, project } = request.body;

    try {
        const FoundService = await pool_connection.query("SELECT * FROM services WHERE service = ?", [service]);
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(`${JSON.stringify(service_password)}`, salt);

        if (!service || !owner_username || !owner_email || !service_password || !project) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service, owner_username, owner_email, service_password, and project name are all required!"
            });
        } else if (!validator.isEmail(owner_email)) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "owner_email is invalid!"
            });
        } else if (service.length < 4) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service name must be at least 4 characters or more!"
            });
        } else if (service.length > 20) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service name must be at most 20 characters or less!"
            });
        } else if (owner_username.length < 4) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "owner_username must be at least 4 characters or more!"
            });
        } else if (owner_username.length > 20) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "owner_username must be at most 20 characters or less!"
            });
        } else if (project.length < 4) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "project name must be at least 4 characters or more!"
            });
        } else if (project.length > 20) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "project name must be at most 20 characters or less!"
            });
        } else if (FoundService[0][0]?.length > 0 || FoundService[0][0]?.service === service) {
            return response.status(400).jsonp({
                message: "bad request",
                error: "service already exists in our databases!"
            });
        } else {
            const description = "description";

            await pool_connection.query("INSERT INTO services (service_id, service, service_password, service_owner, service_owner_email, description, project_name, _date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [uuid(), service, hash, owner_username, owner_email, description, project, format(new Date(), "yyyy-MM-dd")]);
            // 
            await mailer(owner_email
                , "Web Authentication Service", service, owner_username);
            // 
            response.status(201).jsonp({
                message: "Service registered successfully!",
                data: {
                    service: service,
                    owner_username: owner_username,
                    owner_email: owner_email,
                    project: project,
                    description: "Service description"
                },
                date: format(new Date(), "yyyy-MM-dd"),
                signup_id: uuid()
            });
        }

    } catch (error) {
        console.log(error);
        response.status(Number.parseInt(500))
            .json({
                error: error.message,
                message: "Error while creating service!"
            });
    }
};