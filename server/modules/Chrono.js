var Stopwatch = require('timer-stopwatch');
var constants = require('../../commons/constants');


var Chrono = {
	duration: null,
	timer: new Stopwatch(1),
	init: function (pubInterface, defaultDuration) {
		this.duration = defaultDuration;
		this.setEventInterface(pubInterface);
	},
	setEventInterface: function (ps) {
		var that = this;
		this.ps = ps;
		this.timer.on('done', function () {
			ps.publish(constants.MESSAGE.TIMER_END, {});
		});

		ps.subscribe(constants.MESSAGE.QUESTION_START, function () {
			that.reset(that.duration);
			that.timer.start();
		});
	},
	start: function () {
		this.timer.start();
	},
	stop: function () {
		this.timer.stop();
	},
	reset: function (time) {
		this.duration = time || null;

		this.timer.reset(this.duration);
	},
	getTime: function () {
		return this.duration - this.timer.ms;
	},
};

module.exports = Chrono;