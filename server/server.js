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
var route = require('./../route')(app);
var players = [];
var count = 0;
var questionNumber = 0;
DB.init();

// DB.getQuestion(function (raws) {
// 	console.log('getQuestion : ');
// 	console.info(raws);
// 	DB.getResponses(raws[0].id_question, function (rows) {
// 		console.log('getResponses : ');
// 		console.log(rows);
// 	});
// });

// DB.getGivenResponsesnses(function (rows) {
// 	console.log('getGivenResponses : ');
// 	console.log(rows);
// });


Chrono.init(ps, 5000);

//app.use(express.static(__dirname ));
app.use(express.static(__dirname + "/../"));


ps.subscribe(ioAdapter.EVENT_READY, function () {
	DB.getQuestionNumber(function (nbr) {
		questionNumber = nbr;
		console.log('There are ' + nbr + ' questions');
	});

	ps.subscribe('PING', function (data) {
		console.log('fom : ' + data.from);
		ps.publish('PING_BACK', {to:data.from});
	});

	/*ps.subscribe(constants.MESSAGE.NEW_PLAYER, function (data) {
		if (players.indexOf(data.nickname) === -1) {
			players.push(data.nickname);
			ps.publish(constants.MESSAGE.PLAYER_REGISTERED, data);
		} else {
			ps.publish(constants.MESSAGE.INVALID_NICKNAME, {to:data.from});
		}
	});*/

	ps.subscribe(constants.MESSAGE.GAME_START, function () {
		count++;
		if (count <= questionNumber) {
			DB.getQuestion(function (rows) {
				ps.publish(constants.MESSAGE.QUESTION_START, {question: rows[0].content, answers: [rows[0].res1, rows[0].res2, rows[0].res3, rows[0].res4]});
				curQuestion = rows[0].id_question;
				Chrono.reset(Chrono.duration);
				Chrono.start();
			});
		} else {
			console.log('Qu\'est ce qu\'on fait quand on a fini ?');
			//définir un event de fin de jeu
		}
	});

	ps.subscribe(constants.MESSAGE.ANSWER_SENT, function (res) {
		var ourTime = Chrono.getTime();
		DB.addResponse(1, curQuestion, ourTime.toString(), res.response, "player", function (ok) {
			console.log('try to insert in bdd for');
			console.log(ourTime);
			ps.publish(constants.MESSAGE.ADD_SCORE, {player: res.player, id_question: res.question, response: ok});
		});
		//COnfirmation à Mathias #1
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