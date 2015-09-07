var Stopwatch = require('timer-stopwatch');
var constants = require('../../commons/constants');


var Chrono = {
	duration: null,
	timer: new Stopwatch(1),
	init: function (pubInterface, defaultDuration) {
		this.setEventInterface(pubInterface);

		this.reset(defaultDuration);
	},
	setEventInterface: function (ps) {
		var that = this;
		this.ps = ps;
		this.timer.on('done', function () {
			ps.publish(constants.MESSAGE.TIMER_END, {});
		});

		ps.subscribe(constants.MESSAGE.QUESTION_START, function () {
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
		return this.duration - timer.ms;
	},
};

module.exports = Chrono;