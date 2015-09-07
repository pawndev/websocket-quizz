(function () {

    var listeners = {};
    var listenersAutoIncrement = 0;
    var netInterface = null;

    function addNetworkListener(net) {
        var type;
        function connectionCallback (clientSocket) {
            pubsub.publish('CONNECT', {}, true);

            if (clientSocket !== undefined) {
                socket = clientSocket;
            } else {
                socket = net;
            }
            socket.on('message', function (payload) {
                type = payload.type;
                delete payload.type;

                if (typeof socket.id !== undefined) {
                    payload.from = socket.id;
                }

                pubsub.publish(type, payload, true);
            });
            if (typeof module === 'object' && module && typeof module.exports !== undefined) {
                netInterface = net;
            } else {
                netInterface = socket;
            }
        }
        if (typeof module === 'object' && module && typeof module.exports !== undefined) {
            net.on('connection', connectionCallback);
        } else {
            net.on('connect', connectionCallback);
        }
    }

    function removeNetworkListener(netInterface) {

    }

    var pubsub = {
        publish: function (message, payload, noNetForwarding) {
            var listener;

            if (message === undefined || payload === undefined) {
                throw new Error('missing message or payload');
            }

            // nobody is listening
            if (listeners[message] !== null) {
                for (var listenerIndex in listeners[message]) {
                    if (listeners[message].hasOwnProperty(listenerIndex)) {
                        listener = listeners[message][listenerIndex];
                        if (Array.isArray(listener)) {
                            listener[0].call(listener[1], payload);
                        } else {
                            listener.call(this, payload);
                        }
                    }
                };                
            }

            if (netInterface !== null && noNetForwarding !== true) {
                payload.type = message;
                netInterface.emit('message', payload);
            }

        },
        subscribe: function (message, callback) {
            listenersAutoIncrement++;
            if (listeners[message] === undefined) {
                listeners[message] = {};
            }
            listeners[message][(listenersAutoIncrement).toString()] = callback;
            return listenersAutoIncrement;
        },
        unsubscribe: function (message, index) {
            var stillHasListeners = false;
            if (listeners[message] == undefined || listeners[message][index] == undefined) {
                return;
            }

            delete listeners[message][index];

            for (var prop in listeners[message]) {
                if (listeners[message].hasOwnProperty(prop)) {
                    stillHasListeners = true;
                    break;
                }
            }
            if (stillHasListeners === false) {
                delete listeners[message];
            }
        },
        setNetworkAdapter: function (networkAdapter) {
            if (netInterface !== null) {
                removeNetworkListener(netInterface);
            }

            networkAdapter.setup(this, function (net) {
                netInterface = net
            });
        },
        setNetworkInterface: function (networkInterface) {
            if (netInterface !== null) {
                removeNetworkListener(netInterface);
            }
            netInterface = networkInterface;
            
            addNetworkListener(netInterface);
        }        
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = pubsub;
    } else {
        define(pubsub);
    }

})();