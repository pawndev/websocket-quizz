var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var fs = require('fs');
var mysql = require('mysql');
var util = require('util');
var DB = require('./modules/DB');
var Stopwatch = require('timer-stopwatch');
var questionTime = 10000;
var timer = new Stopwatch(questionTime);
var curTime;
timer.on('time', function (time) {
	curTime = time.ms;
});

app.use(express.static(__dirname + "/assets"));

app.get('/', function (req, res) {
    
});

io.sockets.on('connection', function (socket) {
    socket.on('GAME_START', function () {
    	//fetch question
    	DB.getQuestion(function (rows) {
    		socket.emit('GAME_START', {question: rows[0].content});
    		socket.curQuestion = rows[0].id_question;
    		timer.start();
    	});
    	//emit event envoi de la question
    	//emit event affichage boutons
    });
    socket.on('ANSWER_SENT', function (res) {
    	var past = curTime;
    	var ourTime = questionTime - curTime;
    	DB.addResponse(1, socket.curQuestion, ourTime, res, )
    });
});

server.listen(8080);
console.log('running on port : 8080');