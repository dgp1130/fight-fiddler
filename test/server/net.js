var request = require("request");

var constants = require("../helpers/constants.js");
var app = require("../../build/app.js");

var getContentType = function (res) {
    return res.headers["content-type"].replace("; charset=UTF-8", "");
}

module.exports = {
    returnsValidFile: function (test) {
	test.expect(1);
	request(constants.url + "/test/file.html", function (err, res, body) {
	    test.strictEqual(body, "<html></html>", "Server should return a valid file when requested.");
	    test.done();
	});
    },
    
    returnsIndexPage: function (test) {
	test.expect(1);
	request(constants.url + "/test/", function (err, res, body) {
	    test.strictEqual(body, "<index></index>", "Server should return .../index.html when a directory is requested");
	    test.done();
	});
    },
    
    returns404Error: function (test) {
	test.expect(2);
	request(constants.url + "/test/DNE.ext", function (err, res, body) {
	    test.strictEqual(getContentType(res), "text/plain", "Server should return a \"Content-Type\" of \"text/plain\" when accessing a non-existant file.");
	    test.strictEqual(body, "HTTP 404 File Not Found", "Server should return \"HTTP 404 File Not Found\" when accessing a non-existant file.");
	    test.done();
	});
    },
    
    returnsCorrectContentType: function (test) {
	var barrier = 3;
	test.expect(3);
	
	request(constants.url + "/test/file.html", function (err, res, body) {
	    test.strictEqual(getContentType(res), "text/html", "Server should return a \"Content-Type\" of \"text/html\" when accessing a .html file.");
	    if (--barrier === 0) test.done();
	});
	
	request(constants.url + "/test/file.js", function (err, res, body) {
	    test.strictEqual(getContentType(res), "application/javascript", "Server should return a \"Content-Type\" of \"application/javascript\" when accessing a .js file");
	    if (--barrier === 0) test.done();
	});
	
	request(constants.url + "/test/file.css", function (err, res, body) {
	    test.strictEqual(getContentType(res), "text/css", "Server should return a \"Content-Type\" of \"text/css\" when accessing a .css file.");
	    if (--barrier === 0) test.done();
	});
    }
}
