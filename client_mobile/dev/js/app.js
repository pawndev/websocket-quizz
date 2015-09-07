require(['domReady', 'socketio','../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, pubsub) {

    var domBody,
        listenerId;

    domReady(function () {
        dm.run();

        domBody = dm.query('body');

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);

        domButtons = dm.queryAll('button');

        domBody.addClass('wait');
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

});