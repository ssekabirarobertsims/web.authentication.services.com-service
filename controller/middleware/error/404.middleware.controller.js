"use strict";
debugger;
module.exports = async function (request, response) {
  response.contentType = ["plain/text", "text/html", "Application/json"];
  response.statusCode = Number.parseInt(404);

  response
      .status(Number.parseInt(404))
      .sendFile(require("node:path").join(__dirname, "../../../view/404.html"));
};
