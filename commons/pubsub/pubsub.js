(function () {

    var listeners = {};
    var listenersAutoIncrement = 0;
    var netInterface = null;

    function addNetworkListener(netInterface) {
        var type;
        netInterface.on('message', function (payload) {
            type = payload.type;
            delete payload.type;
            pubsub.publish(type, payload, true);
        });
    }

    function removeNetworkListener(netInterface) {

    }

    var pubsub = {
        publish: function (message, payload, noNetForwarding) {
            var listener;

            // nobody is listening
            if (listeners[message] === null) {
                return;
            }

            for (var listenerIndex in listeners[message]) {
                if (listeners[message].hasOwnProperty(listenerIndex)) {
                    listener = listeners[message][listenerIndex];
                    if (Array.isArray(listener)) {
                        listener[0].call(listener[1], payload);
                    } else {
                        listener.call(this, payload);
                    }
                    if (netInterface !== null && noNetForwarding !== true) {
                        payload.type = message;
                        netInterface.emit('message', payload);
                    }
                }
            };
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