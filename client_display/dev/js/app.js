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

        var domMessage;

        pubsub.subscribe(constants.MESSAGE.PLAYER_REGISTERED, function (data) {
            if (domBody.hasClass('wait')) {
                dm.query('.wait .message-box').html(data.nickname + ' is in da house!')
                                              .removeClass('fadeOut')
                                              .after(2, function () {
                                                  this.addClass('fadeOut');
                                              });

            }
        });

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
        var domScreen = dm.query('.screen.result-layout'), lid;

        domScreen.html(JSON.stringify(result));

        domBody.removeClass('end-layout');
        domBody.addClass('result-layout');

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);
        lid = pubsub.subscribe(constants.MESSAGE.GAME_END, function () {
            pubsub.unsbbscribe(constants.MESSAGE.GAME_END, lid);

            // display final score
        });
    }

    window.pubsub = pubsub;

});