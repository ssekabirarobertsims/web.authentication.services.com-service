"use strict";
module.exports = async function (request, response) {
    response.contentType = ["plain/text", "text/html", "Application/json"];
    response.statusCode = Number.parseInt(404);

    if (request.accepts("plain/text")) {
        response.status(Number.parseInt(404))
            .send("404 Not Found!");
    } else if (request.accepts("text/html")) {
        response.status(Number.parseInt(404))
            .sendFile(require("node:path").join(__dirname, "../../../view/404.html"));
    } else {
        response.status(Number.parseInt(404))
            .jsonp({
                "ERROR 404": "Not Found!"
            });
    }
}