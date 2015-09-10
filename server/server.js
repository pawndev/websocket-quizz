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
var PlayerManager = require('./playerManager');
var route = require('./../route')(app);
var players = [];
var count = 0;
var questionNumber = 0;
DB.init();

Chrono.init(ps, 5000);

app.use(express.static(__dirname + "/../"));

var game = new PlayerManager(ps);

ps.subscribe(ioAdapter.EVENT_READY, function () {
	
	game.run();

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

	/*ps.publish(constants.MESSAGE.NEW_PLAYER, {nickname: "Chris"});
	ps.publish(constants.MESSAGE.NEW_PLAYER, {nickname: "Mathias"});
	ps.publish(constants.MESSAGE.PLAYER_READY, {});
	ps.publish(constants.MESSAGE.PLAYER_READY, {});*/
	

	ps.subscribe(constants.MESSAGE.GAME_START, function () {
		count++;
		if (count <= questionNumber) {
			DB.getQuestion(function (rows) {
				ps.publish(constants.MESSAGE.QUESTION_START, {question: rows[0].content, answers: [rows[0].res1, rows[0].res2, rows[0].res3, rows[0].res4]});
				curQuestion = rows[0].id_question;
				//Chrono.reset(Chrono.duration);
				//Chrono.start();
			});
		} else {
			console.log('Qu\'est ce qu\'on fait quand on a fini ?');
			console.log('Voila le resultat de fin : ');
			console.info(game.scores);
			//définir un event de fin de jeu
			ps.publish(constants.MESSAGE.RESULT_SENT, game.scores);
		}
	});

	ps.subscribe(constants.MESSAGE.ANSWER_SENT, function (res) {
		var ourTime = Chrono.getTime();
		res.question = res.question || curQuestion;
		res.nickname = res.nickname || "Chris";
		DB.addResponse(1, res.question, ourTime.toString(), res.response, res.nickname, function (ok, goodRes) {
			ps.publish(constants.MESSAGE.ADD_SCORE, {player: res.nickname, id_question: res.question, response: ok, goodRes: goodRes});
		});
	});

	ps.subscribe(constants.MESSAGE.TIMER_END, function () {
		console.log('TIMER_END');
		DB.getGivenResponses(function (rows) {
			ps.publish(constants.MESSAGE.RESULT_SENT, {rows: rows});
		});
	});
});

ioAdapter.setPort(8000);
ps.setNetworkAdapter(ioAdapter);

server.listen(8080);
console.log('running on port : 8080');