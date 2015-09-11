var fs = require('fs');
var path = require('path');
var express = require('express');
module.exports = function (app) {	

	app.use('/mobile', express.static(__dirname + "/client_mobile"));
	app.use('/display', express.static(__dirname + "/client_display"));
	app.use(express.static(__dirname + "/"));
	app.get('/display/:file', function (req, res) {
	   	res.sendfile(path.resolve(__dirname + '/client_display/prod/' + req.params.file));
	});

	app.get('/mobile/:file', function (req, res) {
	   	res.sendfile(__dirname + '/client_mobile/prod/' + req.params.file);
	   	//res.sendfile(path.resolve(__dirname + '/../client_mobile/prod/' + req.params.file));
	});
}