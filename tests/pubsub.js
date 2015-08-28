// require lib to test
var pubsub = require('../commons/pubsub/pubsub');

// setup context
var callbackCalledCount = 0;
function callback(payload) {
    callbackCalledCount++;
    console.log("callback called " + callbackCalledCount + " | payload " + JSON.stringify(payload));
}

// API tests
var id = pubsub.subscribe("fireCallback", callback);
console.log("callback id : " + id);

// should not display anything
pubsub.publish('doNotFireCallback', {});

// should display "callback called 1 | payload {tata: "toto"}"
pubsub.publish('fireCallback', {tata: "toto"}); 

// should not display anything
pubsub.unsubscribe('doNotFireCallback', id);

// should display "callback called 2 | payload {tata: "toto2"}"
pubsub.publish('fireCallback', {tata: "toto2"});

// should not display anything
pubsub.unsubscribe('fireCallback', id);

// should not display anything
pubsub.publish('fireCallback', {tata: "toto3"});

// mock network call
var socket = require('../commons/mocks/socket');
pubsub.subscribe("fireCallback", callback);
pubsub.setNetworkInterface(socket);
socket.emit('message', {type:"fireCallback", tata:"toto4"});