var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var fs = require('fs');
var jsonfile = require('jsonfile');
var mysql = require('mysql');
var sqlInfo;

jsonfile.readFile(__dirname + '/database.json', function (err, obj) {
    if (err) {
        console.log(err);
    } 
    sqlInfo = obj;
});


var connection = mysql.createConnection(sqlInfo);

connection.connect();

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