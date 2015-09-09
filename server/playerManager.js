var constants = require('../commons/constants');
var DB = require('./modules/DB');

var PlayerManager = function (pubsub) {
	this.ps = pubsub;
	this.players = [];
	this.scores = []; // [{question: 1, results: {p1: true, p2: false}}];
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

		// {player: 'player', id_question: 1, response: 0 || 1};
		this.ps.subscribe(constants.MESSAGE.ADD_SCORE, function (data) {
			if (data.response === 1) {
				data.response = true;
			} else {
				data.response = false;
			}
			console.log('new response : ' + data.response);
			if (that.players.indexOf(data.player) !== -1) {
				console.log('je passe ce if de *****');
				if (!that.scores[data.id_question - 1]) {
					that.scores[data.id_question - 1] = {};
					that.scores[data.id_question - 1].question = data.id_question;
					that.scores[data.id_question - 1].results = {};
				}
				that.scores[data.id_question - 1].results[data.player] = data.response;
			}
			console.log(that.scores);
		});
	};
};

module.exports = PlayerManager;