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
var constants = require('../commons/constants');
var ioAdapter = require('../commons/pubsub/adapter.socketio');
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
				ps.publish(constants.MESSAGE.RESULT_SENT, {rows: rows});
			});
		});
	}
});

app.use(express.static(__dirname + "/../"));

app.get('/', function (req, res) {
    
});

ps.publish('CONNECT', {});

ps.subscribe('DOMREADY', function () {
	console.log('the dom is ready');
});

ps.subscribe(constants.MESSAGE.GAME_START, function () {
	DB.getQuestion(function (rows) {
		ps.publish(constants.MESSAGE.QUESTION_START, {question: rows[0].content});
		curQuestion = rows[0].id_question;
		timer.start();
	});
});

ps.subscribe(constants.MESSAGE.ANSWER_SENT, function (res) {
	var past = curTime;
	var ourTime = questionTime - curTime;
	DB.addResponse(1, curQuestion, ourTime, res.res, "player", function () {
		console.log('try to insert in bdd');
		console.log(ourTime);
	});
});

ioAdapter.setPort(8000);
ps.setNetworkAdapter(ioAdapter);

server.listen(8080);
console.log('running on port : 8080');