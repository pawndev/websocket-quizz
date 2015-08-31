var listeners = [];
var socket = {

    on: function (event, callback) {
        listeners.push(callback);
    },
    emit: function (message, payload) {
        listeners.forEach(function (fn) {
            fn.call(this, payload);
        });
    }
}

module.exports = socket;