var mysql = require('mysql');
var fs = require('fs');

var DB = {
	allQuestion: [],
	init: function () {
		var myCo;
		var data = fs.readFileSync(__dirname + '/../database.json');
		myCo = mysql.createConnection(JSON.parse(data));
		myCo.connect();
		this.connection = myCo;
	},
	getQuestion: function (callback) {
		var that = this;
		var notIn = "0";
		var SQLquery = "SELECT id_question, content, res1, res2, res3, res4, goodRes FROM question WHERE 1 = 1";
		for (var i = 0; i < this.allQuestion.length; i++) {
			notIn += ", " + this.allQuestion[i];
		}
		SQLquery += " AND id_question NOT IN (" + notIn + ")";
		this.connection.query(SQLquery, function (err, rows) {
			if (err) throw err;
			that.allQuestion.push(rows[0].id_question);
			callback.call(this, rows);
		});
	},
	getQuestions: function (id_question, callback) {
		if (typeof id_question === "function") {
			callback = id_question;
			id_question = null;
		}
		var SQLquery = "SELECT id_question, content FROM question";
		SQLquery += id_question !== null ? " WHERE id_question = " + id_question : "";
		this.connection.query(SQLquery, function (err, rows) {
			if (err) throw err;
			callback.call(this, rows);
			return rows;
		});
	},
	setStartTime: function () {

	},
	addResponse: function (session, id_question, time, response, user, callback) {
		var that = this;
		this.getResponses(id_question, function (questionRes) {
			var score = 0;
			if (questionRes[0].goodRes == response) {
				score = 1
			}
			var correctRes = questionRes[0]['res' + questionRes[0].goodRes];
			var data = {
				id_session: session,
				id_question: parseInt(id_question),
				time: time,
				resSent: parseInt(response),
				user: user,
				score: parseInt(score)
			};
			that.connection.query("INSERT INTO session SET ?", data, function (err, result) {
				if (err) throw err;
				callback.call(that, score, questionRes[0].goodRes);
			});
			//callback.call(this, questionRes);
		});
	},
	getResponses: function (id_question, callback) {
		if (typeof id_question === "function") {
			callback = id_question;
			id_question = null;
		}
		var SQLquery = "SELECT id_question, res1, res2, res3, res4, goodRes FROM question";
		SQLquery += id_question !== null ? " WHERE id_question = ?" : " WHERE 1 = ?";
		id_question = 1;
		this.connection.query(SQLquery, [id_question], function (err, rows) {
			if (err) throw err;
			callback.call(this, rows);
		});
	},
	getGivenResponses: function (user, callback) {
		var that = this;
		if (typeof user === 'function') {
			callback = user;
			user = null;
			var SQLquery = "SELECT user, id_question, resSent, score FROM session";
			SQLquery += user !== null ? " WHERE user LIKE '%" + user + "%'" : "";
			this.connection.query(SQLquery, function (err, rows) {
				if (err) throw err;
				var givenRes = rows;
				that.getResponses(function (resQuestion) {
					for (var i = 0; i < givenRes.length; i++) {
						givenRes[i].resSent = resQuestion[givenRes[i].id_question - 1]["res" + resQuestion[givenRes[i].id_question - 1]["goodRes"]];
					}
					callback.call(this, givenRes);
				});
			});
		}
	},
	getScore: function (user, callback) {
		if (typeof user === "function") {
			callback = user;
			user = null;
		}
		var SQLquery = "SELECT user, score FROM session ";
	},
	getQuestionCount: function (callback) {
		var that = this;
		this.connection.query('SELECT count(content) AS nbQuestion FROM question', function (err, rows) {
			if (err) {
				console.log(err);
			} else {
				callback.call(that, rows[0].nbQuestion);
			}
		});
	}
};

module.exports = DB;