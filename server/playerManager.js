var constants = require('../commons/constants');
var DB = require('./modules/DB');

var PlayerManager = function (pubsub) {
	this.ps = pubsub;
	this.players = [];
	this.scores = []; // [{question: 1, results: {p1: true, p2: false}}];
	this.total = {};
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
			console.log(that.players.indexOf(data.player) !== -1);
			console.log(that.players.indexOf(data.player));
			console.log(data.player);
			if (that.players.indexOf(data.player) !== -1) {
				console.log('je passe ce if de *****');
				if (!that.total[data.player]) {
					that.total[data.player] = 0;
				}
				data.response === true ? that.total[data.player]++ : that.total[data.player] += 0;
				if (!that.scores[data.id_question - 1]) {
					that.scores[data.id_question - 1] = {};
					that.scores[data.id_question - 1].question = data.id_question;
					that.scores[data.id_question - 1].results = {};
				}

				that.scores[data.id_question - 1].results[data.player] = data.response;
				switch (data.goodRes) {
					case 1:
						data.goodRes = "A";
						break;
					case 2:
						data.goodRes = "B";
						break;
					case 3:
						data.goodRes = "C";
						break;
					case 4:
						data.goodRes = "D";
						break;
				}
				that.ps.publish(constants.MESSAGE.RESULT_SENT, {goodRes: data.goodRes, details: that.scores[that.scores.length - 1], score: that.total});
			}
			console.log('players : ');
			console.log(that.players);
			console.log('scores : ');
			console.log(JSON.stringify({goodRes: data.goodRes, details: that.scores[that.scores.length - 1], score: that.total}));
		});
	};
};

module.exports = PlayerManager;