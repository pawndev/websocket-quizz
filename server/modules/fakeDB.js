
var DB = {
	allQuestion: [
        {
		    content: "Comment boulouter le boulou ?",
		    res1: "Bouloute",
		    res2: "Bala",
		    res3: "Bili",
		    res4: "Nelly",
            goodRes: 1
		},
        {
            content: "Qui est ton père ?",
            res1: "Ton père",
            res2: "Dark Vador",
            res3: "Obiwan kenobi",
            res4: "La réponse D",
            goodRes: 2
        }
    ],
	init: function () {
	},
	getQuestion: function (callback) {
		callback(this.allQuestion);
	},
	addResponse: function (session, id_question, time, response, user, callback) {
		console.log("saving : \nsession : " + session + "\nid_question : " + id_question + "\ntime : " + time + "\nresponse : " + response + "\nuser : " + user);
		callback(1);
	},
	getGivenResponses: function (callback) {
		callback({});
	},
	getQuestionCount: function (callback) {
		callback(this.allQuestion.length);
	}
};

module.exports = DB;