require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, ps) {

    var domBody,
        listenerId;

    io.setPort(8000);
    ps.setNetworkAdapter(io);

    domReady(function () {
        dm.run();

        domBody = dm.query('body');
        domButtons = dm.queryAll('button');
        domBody.addClass('wait');

        ps.subscribe(io.EVENT_READY, function () {
            console.log('connected to server');
            listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);
        });

        console.log('init');
    });

    function displayGameLayout(param) {
        pubsub.unsubscribe(constants.MESSAGE.QUESTION_START, listenerId);
        domBody.removeClass('wait');
        domBody.addClass('game-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.TIMER_END, endTimer);
    }

    function endTimer() {
        pubsub.unsubscribe(constants.MESSAGE.TIMER_END, listenerId);
        domBody.removeClass('game-layout');
        domBody.addClass('end-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.RESULT_SENT, displayResult);
    }

    function displayResult (result) {
        pubsub.unsubscribe(constants.MESSAGE.RESULT_SENT, listenerId);
        domBody.removeClass('end-layout');
        domBody.addClass('result-layout');
    }

    window.pubsub = ps;

});