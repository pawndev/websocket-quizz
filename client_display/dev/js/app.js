require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, pubsub) {

    var domBody,
        listenerId;

    io.setPort(8000);
    pubsub.setNetworkAdapter(io);

    domReady(function () {
        dm.run();

        domBody = dm.query('body');
        domQuestion = dm.query('.question');
        domAnswers = dm.queryAll('.answers');

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);

        /*domButtons = dm.queryAll('button');*/

        domBody.addClass('wait');
        console.log('init');
    });

    function displayGameLayout(param) {
        pubsub.unsubscribe(constants.MESSAGE.QUESTION_START, listenerId);
        domBody.removeClass('wait');
        domBody.addClass('game-layout');
        domQuestion.html(param.question);

        domAnswers.forEach(function (domAnswer) {
            domAnswer.html(param.answers[domAnswer.data('num') - 1]);
        });

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

    window.pubsub = pubsub;

});