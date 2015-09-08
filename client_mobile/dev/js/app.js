require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, ps) {

    var domBody,
        listenerId;

    io.setPort(8000);
    io.setServerUrl(document.location.hostname);
    ps.setNetworkAdapter(io);

    domReady(function () {
        var domButtons, domStartButton, domNickname, domReadyBtn;

        dm.run();

        domBody = dm.query('body');
        domStartButton = dm.query('.start');
        domNickname = dm.query('input[name=nickname]');
        domReadyBtn = dm.query('.reday')
        domButtons = dm.queryAll('.answer');

        domBody.addClass('wait');

        domButtons.forEach(function (btn) {
            btn.on('click', clickAnswerButton);
        });

        domStartButton.on('click', register);

        domReadyBtn.on('click', startGame);

        ps.subscribe(io.EVENT_READY, function () {
            console.log('connected to server');

            domBody.addClass('connected');
            domBody.removeClass('wait');
        });

        console.log('init');
    });

    function register () {
        listenerId = pubsub.subscribe(constants.MESSAGE.PLAYER_REGISTERED, displayBePrepared);
        domBody.addClass('wait');
        pubsub.publish(constants.MESSAGE.NEW_PLAYER, { nickname: domNickname.prop('value') });
    });

    function startGame () {
        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);
        domBody.addClass('wait');
        pubsub.publish(constants.MESSAGE.GAME_START, {});
    }

    function clickAnswerButton(event) {
        var payload = { response: dm.query(this).data('r') };        
        pubsub.publish('ANSWER_SENT', payload);
        domBody.removeClass('game-layout');
        domStartButton.addClass('hidden');
        domBody.addClass('wait');
    }

    function displayBePrepared () {
        if (listenerId !== null) {
            pubsub.unsubscribe(constants.MESSAGE.PLAYER_REGISTERED, listenerId);
            domBody.removeClass('result-layout');
        } else {
            domBody.removeClass('wait');
        }
        domBody.addClass('be-prepared');
    }

    function displayGameLayout (param) {
        pubsub.unsubscribe(constants.MESSAGE.QUESTION_START, listenerId);
        domBody.removeClass('wait');
        domBody.addClass('game-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.TIMER_END, endTimer);
    }

    function endTimer() {
        pubsub.unsubscribe(constants.MESSAGE.TIMER_END, listenerId);
        domBody.removeClass('game-layout');
        domBody.removeClass('wait');

        domBody.addClass('end-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.RESULT_SENT, displayResult);
    }

    function displayResult (result) {
        pubsub.unsubscribe(constants.MESSAGE.RESULT_SENT, listenerId);

        domBody.removeClass('end-layout');
        domBody.addClass('result-layout');

        setTimeout(function () {
            listenerId = null;
            displayBePrepared();
        }, 5000);
    }

    window.pubsub = ps;

});