require(['domReady', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, dm, ps) {

    var domBody,
        PHASE_START = 0
        PHASE_WAIT = 1,
        PHASE_PLAY = 2,
        PHASE_RESULT = 3,
        PHASE_LOGOUT = 4,
        CURRENT_PHASE = PHASE_START/*,
        domBody = null*/;

    var socket = io.connect('http://localhost:8080/');

    ps.setNetworkInterface(socket);

    domReady(function () {

        ps.subscribe('CONNECT', function () {
            console.log('connected');
            ps.publish('DOMREADY', {});    
        });

        ps.subscribe('QUESTION_START', function () {
            console.log('QUESTION HAS START !!!');
        });

        console.log(dm.query('body'));
    });

    function wait(msg) {

    }

    window.pubsub = ps;

});