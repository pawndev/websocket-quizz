var constants = require('../commons/constants');
var DB = require('./modules/DB');

var PlayerManager = function (pubsub) {
	this.ps = pubsub;
	this.players = [];
	this.scores = []; // [{question: 1, results: {p1: true, p2: false}}];7
	this.ready = 0;
	this.run = function () {
		var that = this;
		this.ps.subscribe(constants.MESSAGE.NEW_PLAYER, function (data) {
			if (that.players.indexOf(data.nickname) === -1) {
				that.players.push(data.nickname);
				that.ps.publish(constants.MESSAGE.PLAYER_REGISTERED, data);
			} else {
				that.ps.publish(constants.MESSAGE.INVALID_NICKNAME, {to:data.from});
			}
		});

		this.ps.subscribe(constants.MESSAGE.PLAYER_READY, function () {
			that.ready++;
			if (that.ready === that.players.length) {
				that.ready = 0;
				that.ps.publish(constants.MESSAGE.GAME_START, {});
			}
		});
		// Demander confirmation à Mathias #1
		// {player: res.player, id_question: res.question, res.response}
		this.ps.subscribe(constants.MESSAGE.ADD_SCORE, function (data) {
			if (data.response === 1) {
				data.response = true;
			} else {
				data.response = false;
			}
			//add to question number x, results.[player] = true||false
		});
	};
};

module.exports = PlayerManager;