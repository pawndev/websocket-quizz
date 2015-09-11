require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, pubsub) {

    var domBody,
        listenerId,
        domQuestion,
        domMessage,
        domWaitMessage;

    io.setPort(8000);
    pubsub.setNetworkAdapter(io);

    domReady(function () {
        dm.run();

        domBody = dm.query('body');
        domQuestion = dm.query('.question');
        domAnswers = dm.queryAll('.answers');
        domMessage = dm.query('.wait .message-box');
        domWaitMessage = dm.query('.wait p:first-child');

        var domMessage;

        pubsub.subscribe(constants.MESSAGE.PLAYER_REGISTERED, function (data) {
            if (domBody.hasClass('wait')) {
                domWaitMessage.addClass('hidden');
                domMessage.html(data.nickname + ' is in da house!')
                          .removeClass('fadeOut')
                          .after(2, function () {
                              domWaitMessage.removeClass('hidden');
                              this.addClass('fadeOut');
                          });

            }
        });

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);

        /*domButtons = dm.queryAll('button');*/
        if (domBody.hasClass('result-layout')) {
            domBody.removeClass('result-layout');
        }
        domBody.addClass('wait');
        console.log('init');
    });

    function displayGameLayout(param) {
        //pubsub.unsubscribe(constants.MESSAGE.QUESTION_START, listenerId);
        if (domBody.hasClass('wait')) {
            domBody.removeClass('wait');
        }
        if (domBody.hasClass('result-layout')) {
            domBody.removeClass('result-layout');
        }
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

        /*domQuestion.html(result.question);
        domAnswers.forEach(function (domAnswer) {
            domAnswer.html(result.answers)
        });*/

        domBody.addClass('result-layout');

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);
        lid = pubsub.subscribe(constants.MESSAGE.GAME_END, function () {
            pubsub.unsbbscribe(constants.MESSAGE.GAME_END, lid);

            // display final score
        });
    }

    window.pubsub = pubsub;

});