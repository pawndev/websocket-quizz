var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var fs = require('fs');
var mysql = require('mysql');
var util = require('util');
var Stopwatch = require('timer-stopwatch');
var timer = new Stopwatch(10000);
timer.start();
timer.on('time', function (time) {
	console.log(time.ms);
});

app.use(express.static(__dirname + "/assets"));

app.get('/', function (req, res) {
    
});

io.sockets.on('connection', function (socket) {
    socket.on('member', function (pseudo) {
        socket.pseudo = pseudo;
    });
});

server.listen(8080);
console.log('running on port : 8080');