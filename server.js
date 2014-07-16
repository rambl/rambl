var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

var middle  = require("./server/config/middleware.js");


var port = process.env.PORT || 8080;
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var expressApp = express();
expressApp.use(express.static(__dirname + "/client/"));
middle(expressApp, express);

// Start Express http server on port 8080
var webServer = http.createServer(expressApp).listen(port);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// Start EasyRTC server
easyrtc.setOption('roomDefaultEnable', false);
var rtc = easyrtc.listen(expressApp, socketServer);

module.exports = expressApp;

console.log('Server has started on port ', port);