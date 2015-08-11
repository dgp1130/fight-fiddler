var serveStatic = require("serve-static");
var express = require("express");

var constants = require("./constants.js");
var util = require("./util.js");

// Instantiate libraries
var serve = serveStatic(constants.webroot, { "index": [ "index.html" ] });
var app = express();

// Set port
app.set("port", process.env.PORT || 5000);

// Get file
app.use(function (req, res, next) {
    util.log(req.method + " " + req.originalUrl);
    serve(req, res, next);
});

// Handle HTTP 404 error
app.get("*", function (req, res) {
    util.log("HTTP 404 File Not Found (" + req.originalUrl + ")");
    res.setHeader("Content-Type", "text/plain");
    res.send(new Buffer("HTTP 404 File Not Found", "utf-8"));
});

// Start server
app.listen(app.get("port"), function () {
    util.log("Application running on port " + app.get("port"));
});
