var http    = require("http");              // http server core module
var express = require("express");           // web framework external module
var io      = require("socket.io");         // web socket external module
var easyrtc = require("easyrtc");           // EasyRTC external module

var middle  = require("./server/config/middleware.js");


var port = process.env.PORT || 8080;
// Setup and configure Express http server. Expect a subfolder called "static" to be the web root.
var expressApp = express();

/// __dirname is Users/xianhuifeng/repo/rambl
expressApp.use(express.static(__dirname + "/client/"));
middle(expressApp, express);

// Start Express http server on port 8080
var webServer = http.createServer(expressApp).listen(port);

// Start Socket.io so it attaches itself to Express server
var socketServer = io.listen(webServer, {"log level":1});

// below are modifications to easyrtc defaults

// users are not automatically placed into a default room
easyrtc.setOption('roomDefaultEnable', false);
// enable spaces in room names
var roomNameRegExp = /^([a-z0-9_.-]|\s){1,45}$/i; 
easyrtc.setOption('roomNameRegExp', roomNameRegExp); 
// enable spaces in usernames
var usernameRegExp = /^(.|\s){1,32}$/i;
easyrtc.setOption('usernameRegExp', usernameRegExp); 

// Start EasyRTC server
var rtc = easyrtc.listen(expressApp, socketServer);

module.exports = expressApp;

console.log('Server has started on port ', port);