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
var constants = require('../commons/constants');
var ioAdapter = require('../commons/pubsub/adapter.socketio');
var curQuestion;
var Chrono = require('./modules/Chrono');

DB.init();

// DB.getQuestion(function (raws) {
// 	console.log('getQuestion : ');
// 	console.info(raws);
// });

// DB.


Chrono.init(ps, 10000);

app.use(express.static(__dirname + "/../"));

app.get('/display', function (req, res) {
   	res.sendfile(__dirname + '../client_display/prod/index.html');
});

app.get('/mobile', function (req, res) {
   	res.sendfile(__dirname + '../client_mobile/prod/index.html');
});

ps.subscribe(ioAdapter.EVENT_READY, function () {
	ps.publish('CONNECT', {});

	ps.subscribe('DOMREADY', function () {
		console.log('the dom is ready');
	});

	ps.subscribe(constants.MESSAGE.GAME_START, function () {
		DB.getQuestion(function (rows) {
			ps.publish(constants.MESSAGE.QUESTION_START, {question: rows[0].content, answers: [rows[0].res1, rows[0].res2, rows[0].res3, rows[0].res4]});
			curQuestion = rows[0].id_question;
		});
	});

	ps.subscribe(constants.MESSAGE.ANSWER_SENT, function (res) {
		var ourTime = Chrono.questionTime - Chrono.getTime();
		DB.addResponse(1, curQuestion, ourTime, res.res, "player", function () {
			console.log('try to insert in bdd');
			console.log(ourTime);
		});
	});

	ps.subscribe(constants.MESSAGE.TIMER_END, function () {
		DB.getGivenResponses(function (rows) {
			ps.publish(constants.MESSAGE.RESULT_SENT, {rows: rows});
		});
	});
});

ioAdapter.setPort(8000);
ps.setNetworkAdapter(ioAdapter);

server.listen(8080);
console.log('running on port : 8080');