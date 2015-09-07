(function () {

	var io, onConnectEventName, serverDomain, serverPort;

	var adapter = {
		EVENT_READY: 'READY',
		EVENT_CONNECT: 'CONNECT',
		setup: function (pubsub, callback) {

	        var socket, that = this,
            	domain = serverDomain || 'localhost',
            	port = serverPort || '80';

	        function connectionCallback (clientSocket) {
	            if (clientSocket !== undefined) {
		            pubsub.publish(that.EVENT_CONNECT, { from : clientSocket.id }, true);
	                socket = clientSocket;
	            } else {
	            	pubsub.publish(that.EVENT_READY, {}, true);
	            }
	            socket.on('message', function (payload) {
	                type = payload.type;
	                delete payload.type;

	                if (typeof socket.id !== undefined) {
	                    payload.from = socket.id;
	                }

	                pubsub.publish(type, payload, true);
	            });

	            if (callback === 'function') {
	            	callback.call(this, socket);
	            }
	        }

			if (typeof module === 'object' && module && typeof module.exports !== undefined) {
				io = socketIO(port);
	            pubsub.publish(this.EVENT_READY, {}, true);
	            io.on(onConnectEventName, connectionCallback);
            } else {
            	socket = io.connect(domain + ':' + port);
	            socket.on(onConnectEventName, connectionCallback);
            }            
		},
		setServerUrl: function (domain) {
			serverDomain = domain;
		},
		setPort: function (port) {
			serverPort = port;
		}
	}

    if (typeof module === "object" && module && typeof module.exports === "object") {
		socketIO = require('socket.io');
		onConnectEventName = 'connection';
        module.exports = adapter;
    } else {
        define(['socketio'], function (definedIO) {
        	io = definedIO;
        	onConnectEventName = 'connect';
        	return adapter;
        });
    }
	
})();
