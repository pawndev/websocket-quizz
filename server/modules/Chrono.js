var child = require('child_process');
var Chrono = {
	time: null,
	set: function (time) {
		this.time = time;
	},
	run: function () {
		var that = this;
		setInterval(function () {
			if (that.time === 0) {
				//emit end of game;
				console.log('fin');
				clearInterval(this);
			}
			console.log(that.getCurrent());
			that.time -= 1000;
		}, 1000);
	},
	getCurrent: function () {
		return this.time;
	},
	/*launch: function () {
		child.exec(__filename, function (err, stdout, stderr) {
			console.log(stdout);
		});
		console.log('chrono launch');
	}*/

	
};

(function () {
	Chrono.set(10000);
	Chrono.run();
})();

module.exports = Chrono;