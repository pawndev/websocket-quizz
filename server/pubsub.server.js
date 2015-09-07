var app = require('http').createServer(handler)
var ioAdapter = require('../commons/pubsub/adapter.socketio');
var fs = require('fs');

var ps = require('../commons/pubsub/pubsub');

app.listen(8080);

function handler (req, res) {

  var file = req.url.substr(1) !== "" ? req.url.substr(1) : 'index.html';

  file.substr(1) === "/" ? file = file.substr(1) : null;

  console.log(__dirname + '/../' + file);

  fs.readFile(__dirname + '/../' + file,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading ' + file);
    }

    res.writeHead(200);
    res.end(data);
  });
}

ps.subscribe(ioAdapter.EVENT_READY, function () {

  console.log('serveur up and running');

  ps.subscribe('CONNECT', function (data) {
    console.log(data.from + ' is in da house !');
  });

  ps.subscribe('DOMREADY', function (data) {
      console.log('DOMREADY', data);
  });

  ps.subscribe('GAME_START', function (data) {
    console.log('GAME START !!!', data);
    ps.publish('QUESTION_START', {});
  });

});


ioAdapter.setPort(666)
ps.setNetworkAdapter(ioAdapter);

// io.on('connection', function (socket) {
//   socket.on('message', function (data) {
//     console.log(data);
//   });
// });