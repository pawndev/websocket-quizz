var app = require('express')();
var server = require('http').createServer(app);
var DB = require('./modules/fakeDB');
var constants = require('../commons/constants');
var ps = require('./../commons/pubsub/pubsub.js');
var ioAdapter = require('../commons/pubsub/adapter.socketio');

var Chrono = require('./modules/Chrono');
var PlayerManager = require('./playerManager');

require('./../route')(app);

var curQuestion;
var answers = {};

var goodRes;

var questionNumber = null;
var questionCount = 0;


DB.init();

Chrono.init(ps, 10000);

var pm = new PlayerManager(ps);

ps.subscribe(ioAdapter.EVENT_READY, function () {
	
	// pm.run();

	ps.subscribe('PING', function (data) {
		console.log('fom : ' + data.from);
		ps.publish('PING_BACK', {to:data.from});
	});

	ps.subscribe(constants.MESSAGE.GAME_START, function () {

		if (questionNumber === null) {
			DB.getQuestionCount(function (nbr) {
				questionCount = nbr;
				console.log('There are ' + nbr + ' questions');
			});
			questionNumber = 1;
		} else {
			questionNumber++;	
		}
		
		if (questionNumber <= questionCount) {
			DB.getQuestion(function (rows) {
                var n = questionNumber - 1;
				goodRes = rows[n].goodRes;
				ps.publish(constants.MESSAGE.QUESTION_START, {question: rows[n].content, answers: [rows[n].res1, rows[n].res2, rows[n].res3, rows[n].res4]});
				curQuestion = rows[n].id_question;
			});
		}
	});

	ps.pong(constants.MESSAGE.ANSWER_SENT, function (res) {
		var ourTime = Chrono.getTime();
		res.question = res.question || curQuestion;
		res.nickname = res.nickname || "Chris";
		DB.addResponse(1, res.question, ourTime.toString(), res.response, res.nickname, function (ok) {

			var data = {player: res.nickname};

			answers[res.nickname] = goodRes == res.response ? true : false;
            console.log('MY FUCKING SCORE : ', pm.scores);
            if (goodRes == res.response) {
			    pm.addScore(res.nickname, ok);
                
            }
            for (var i = 0; i < pm.players.length; i++) {
                if (pm.scores[i].player == res.nickname) {
                    data.scoreIncrement = pm.scores[i].score;
                }
            }
			ps.publish(constants.MESSAGE.ADD_SCORE, data);
		});
		return {};
	});

	ps.subscribe(constants.MESSAGE.TIMER_END, function () {
		console.log('TIMER_END');
		DB.getGivenResponses(function (rows) {
			//ps.publish(constants.MESSAGE.ADD_SCORE, {id_question: curQuestion, goodRes: goodRes});
            console.log('pm.scores : ', pm.scores);
            console.log('pm.getSortedScores() : ', pm.getSortedScores());
			if (questionNumber === questionCount) {
				ps.publish(constants.MESSAGE.GAME_END, {ranking: pm.getSortedScores()});
			}
			ps.publish(constants.MESSAGE.RESULT_SENT, {goodRes: goodRes, details: answers, score: pm.getSortedScores() });			
		});
	});
});

ioAdapter.setPort(8000);
ps.setNetworkAdapter(ioAdapter);

server.listen(8080);
console.log('running on port : 8080');