require(['domReady', 'socketio', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, dm, ps) {

    var domBody,
        PHASE_START = 0
        PHASE_WAIT = 1,
        PHASE_PLAY = 2,
        PHASE_RESULT = 3,
        PHASE_LOGOUT = 4,
        CURRENT_PHASE = PHASE_START/*,
        domBody = null*/;

    domReady(function () {
        console.log(dm.query('body'));
    });

    function wait(msg) {

    }

});