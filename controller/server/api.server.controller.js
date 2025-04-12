"use strict";
debugger; // update npm pkg
const express = require("express");
const application = express();
const http = require("http");
const server = http.createServer(application);
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
const compression = require("compression");

application.use(compression());

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

// middleware to serve server static files
application.use(
  express.static(require("node:path").join(__dirname, "../../view/"))
);
application.use(
  express.static(require("node:path").join(__dirname, "../../public/"))
);
application.use(
  express.static(require("node:path").join(__dirname, "../../view/"))
);
application.use(
  express.static(require("node:path").join(__dirname, "../../public/"))
);
application.use(
  express.static(
    require("node:path").join(__dirname, "../../public/stylesheets")
  )
);
application.use(
  express.static(require("node:path").join(__dirname, "../../public/photos"))
);

// fs read static files and static dirs
const fsp = require("node:fs/promises");
const fs = require("node:fs");

fs.readdir(require("node:path").join(__dirname, "../../view/"), (error, data) =>
  error
    ? console.log("Error while reading dir", error)
    : console.log("read dir ../../view/")
);

fs.readdir(
  require("node:path").join(__dirname, "../../public/"),
  (error, data) =>
    error
      ? console.log("Error while reading dir", error)
      : console.log("read dir ../../public/")
);

fs.readdir(
  require("node:path").join(__dirname, "../../public/stylesheets/"),
  (error, data) =>
    error
      ? console.log("Error while reading dir", error)
      : console.log("read dir ../../public/stylesheets/")
);

fs.readdir(
  require("node:path").join(__dirname, "../../public/photos/"),
  (error, data) =>
    error
      ? console.log("Error while reading dir", error)
      : console.log("read dir ../../public/photos/")
);

// configurations
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
