require(['domReady', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, constants, dm, pubsub) {

    var domBody,
        listenerId;

    domReady(function () {
        var domButtons;

        dm.run();

        domBody = dm.query('body');

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);

        domButtons = dm.queryAll('button');
        domButtons.forEach(function (btn) {
            btn.on('click', onClickButton);
        });

        domBody.addClass('wait');
        console.log('init');
    });

    function onClickButton(event) {
        var payload = { response: dm.query(this).attr('data-r') };
        pubsub.publish('ANSWER_SENT', payload);
    }

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