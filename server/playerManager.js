var constants = require('../commons/constants');

var PlayerManager = function (pubsub, disableAutoRun) {
	this.ps = pubsub;
	this.players = []; // ['nickname1', 'nickname2']
	this.scores = []; // [{player: 'string nickname', score: 1}, {player: 'string nickname2', score: 3}];
	this.ready = 0;
	this.resetScores = function() {
		this.scores = [];
		this.players.forEach(function (player) {
			this.scores.push({'player': player, score: 0});
		}, this);
	};
	this.getSortedScores = function () {
		this.scores.sort(function (a, b) {
			if (a.score > b.score)
				return 1;
			if (a.score < b.score)
				return -1
			return 0;
		});

		this.players = [];
		this.scores.forEach(function (score) {
			this.players.push(score.player);
		}, this);

		return this.scores;
	};
	this.exists = function (nickname, returnIdx) {
		var idx = this.players.indexOf(nickname);
		return returnIdx ? idx : (idx !== -1);
	};
	this.addPlayer = function (nickname) {
		if (!this.exists(nickname)) {
			this.players.push(nickname);
			return true			
		} else {
			return false;
		}
	}
	this.addScore = function (player, scoreInc) {
		var plIdx = this.exists(player, true);

		if (plIdx !== -1) {
			this.scores[plIdx].score += scoreInc;
		}
	};
	this.run = function () {
		var that = this, lid;
		lid = this.ps.subscribe(constants.MESSAGE.NEW_PLAYER, function (data) {
			if (that.addPlayer(data.nickname)) {
				that.ps.publish(constants.MESSAGE.PLAYER_REGISTERED, data);
			} else {
				that.ps.publish(constants.MESSAGE.INVALID_NICKNAME, {to:data.from});
			}
		});

		this.ps.subscribe(constants.MESSAGE.PLAYER_READY, function () {
			that.ready++;
			if (that.ready === that.players.length) {
				that.ps.unsubscribe(constants.MESSAGE.NEW_PLAYER, lid);
				that.ready = 0;

				that.resetScores();

				// {player: 'player', scoreIncrement: 1};
				that.ps.subscribe(constants.MESSAGE.ADD_SCORE, function (data) {
					that.addScore(data.player, data.scoreIncrement);
				});

				that.ps.publish(constants.MESSAGE.GAME_START, {});
			}
		});
	};
	if (!disableAutoRun) {
		this.run();
	}
};

module.exports = PlayerManager;