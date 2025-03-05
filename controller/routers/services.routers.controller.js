"use strict";
const express = require("express");
const router = express.Router();
const pool_connection = require("../../model/connection/model.connection");
const { format } = require("date-fns");
const apicache = require("apicache");
const cache = apicache.middleware; 

router.route("/registered/services/:id").get(require("../middleware/jwt/jwt.middleware.controller"), cache("5 minutes"), async (request, response) => {
    response.contentType = "Application/json";
    response.statusCode = Number.parseInt(200);

    try {
        const FoundService = await pool_connection.query("SELECT * FROM services WHERE service_id = ?", [request.params.id]);

        if (!FoundService[0][0]) {
            response.status(Number.parseInt(404))
                .json({
                    error: "404",
                    message: "No such service was found!",
                });
        } else {
            response.status(Number.parseInt(200))
                .json({
                    message: "1 service was found from database!",
                    service: FoundService[0][0]?.service,
                    service_owner: FoundService[0][0]?.service_owner,
                    service_id: FoundService[0][0]?.service_id,
                    description: FoundService[0][0]?.description,
                    project_name: FoundService[0][0]?.project_name,
                    _date: FoundService[0][0]?._date,
                });
        }
    } catch (error) {
        console.log(error);
        response.status(Number.parseInt(500))
            .json({
                message: "Error while fetching services!"
            });
    }
}).delete(require("../middleware/jwt/jwt.middleware.controller"), async (request, response) => {
    response.contentType = "Application/json";
    response.statusCode = Number.parseInt(200);

    try {
        const FoundService = await pool_connection.query("SELECT * FROM services WHERE service_id = ?", [request.params.id]);

        if (!FoundService[0][0]) {
            response.status(Number.parseInt(404))
                .json({
                    error: "404",
                    message: "No such service was found!",
                });
        } else {
            await pool_connection.query(`
                    DELETE FROM services WHERE service_id = ?
                `, [FoundService[0][0].service_id]);

            response.status(Number.parseInt(200))
                .json({
                    message: `"${FoundService[0][0]?.service}" service has been deleted permanently!`,
                    date: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                });
        }
    } catch (error) {
        console.log(error);
        response.status(Number.parseInt(500))
            .json({
                message: "Error while fetching services!"
            });
    }
});

// test api routes
router.route("/service/registration").post(require("../auth/services.registration.controller"));
router.route("/service/login").post(require("../auth/services.login.controller"));

module.exports = router;