var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ent = require('ent');
var fs = require('fs');
var mysql = require('mysql');
var util = require('util');
var DB = require('./modules/DB');
var ps = require('./../commons/pubsub/pubsub.js');
var Stopwatch = require('timer-stopwatch');
var questionTime = 10000;
var curQuestion;
var timer = new Stopwatch(questionTime);
var curTime;
DB.init();

timer.on('time', function (time) {
	curTime = time.ms;
	console.log(time.ms);
	if (time.ms <= 0) {
		DB.addResponse(1, curQuestion, questionTime, "", "player", function () {
			console.log('out of time');
			DB.getGivenResponses(function (rows) {
				ps.publish('RESULT_SENT', {rows: rows});
			});
		});
	}
});

app.use(express.static(__dirname + "/../"));

app.get('/', function (req, res) {
    
});

ps.setNetworkInterface(io);

ps.publish('CONNECT', {});

ps.subscribe('DOMREADY', function () {
	console.log('the dom is ready');
});

ps.subscribe('GAME_START', function () {
	DB.getQuestion(function (rows) {
		ps.publish('QUESTION_START', {question: rows[0].content});
		curQuestion = rows[0].id_question;
		timer.start();
	});
});

ps.subscribe('ANSWER_SENT', function (res) {
	timer.stop();
	var past = curTime;
	var ourTime = questionTime - curTime;
	DB.addResponse(1, curQuestion, ourTime, res.res, "player", function () {
		console.log('try to insert in bdd');
		console.log(ourTime);
	});
});


server.listen(8080);
console.log('running on port : 8080');