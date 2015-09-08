var fs = require('fs');
var path = require('path');
module.exports = function (app) {	
	app.get('/display/:file', function (req, res) {
	   	res.sendfile(path.resolve(__dirname + '/client_display/prod/' + req.params.file));
	});

	app.get('/mobile/:file', function (req, res) {
	   	res.sendfile(__dirname + '/client_mobile/prod/' + req.params.file);
	   	//res.sendfile(path.resolve(__dirname + '/../client_mobile/prod/' + req.params.file));
	});
}