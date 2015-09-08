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
var path = require('path');
DB.init();

// DB.getQuestion(function (raws) {
// 	console.log('getQuestion : ');
// 	console.info(raws);
// 	DB.getResponses(raws[0].id_question, function (rows) {
// 		console.log('getResponses : ');
// 		console.log(rows);
// 	});
// });

// DB.getGivenResponses(function (rows) {
// 	console.log('getGivenResponses : ');
// 	console.log(rows);
// });


Chrono.init(ps, 10000);

//app.use(express.static(__dirname ));
app.use(express.static(__dirname + "/../"));

app.get('/display/:file', function (req, res) {
   	res.readFile(path.resolve(__dirname + '/../client_display/prod/' + req.params.file));
});

app.get('/mobile/:file', function (req, res) {
   	fs.readFile(__dirname + '/../client_mobile/prod/' + req.params.file);
   	//res.sendfile(path.resolve(__dirname + '/../client_mobile/prod/' + req.params.file));
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