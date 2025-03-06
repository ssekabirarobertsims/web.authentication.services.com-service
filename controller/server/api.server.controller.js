"use strict";
debugger;
const express = require("express");
const application = express();
const http = require("http");
const server = http.createServer(application);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const compression = require("compression");

// application.use(compression());

application.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

application.use(async function (request, response, next) {
  response.statusCode = Number(parseInt(200));
  response.contentType = "Application/json";

  response.setHeader("Access-Control-Allow-Credentials", Boolean(true));
  response.setHeader("Access-Control-Allow-Methods", "DELETE, GET, POST");
  response.setHeader("Access-Control-Allow-Origins", "*");
  next();
});

application.use(bodyParser.urlencoded({ extended: Boolean(false) }));
application.use(express.urlencoded({ extended: Boolean(false) }));
application.use(express.json());
application.use(bodyParser.json());
application.use(cookieParser());
application.use(
  express.static(require("node:path").join(__dirname, "../../view/"))
);
application.use(
  express.static(require("node:path").join(__dirname, "../../public/"))
);
application.set("port", 3500);

//
application.use("/", require("../routers/root.routers.controller"));
application.use("/api", require("../routers/services.routers.controller"));

application.use(require("../middleware/error/404.middleware.controller"));

server.listen(application.get("port"), () => {
  server.listening
    ? console.log("api server started successfully!")
    : console.log("failed to start server!");
});

module.exports = application;
