
var DB = {
	allQuestion: [],
	init: function () {
	},
	getQuestion: function (callback) {
		callback([{
			content: "Comment boulouter le boulou ?",
			res1: "A. boulou boulou",
			res2: "B. bou... lou... boulou",
			res3: "C. boulou... bou... lou...",
			res4: "D. boulou lou boulou"
		}]);
	},
	addResponse: function (session, id_question, time, response, user, callback) {
		console.log("saving : \nsession : " + session + "\nid_question : " + id_question + "\ntime : " + time + "\nresponse : " + response + "\nuser : " + user);
		callback(1);
	},
	getGivenResponses: function (callback) {
		callback({});
	},
	getQuestionCount: function (callback) {
		callback(1);
	}
};

module.exports = DB;