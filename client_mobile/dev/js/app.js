require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, ps) {

    var domBody,
        domButtons, domStartButton, domNickname, domReadyBtn, domMessage, domWaitMessage, domResultScreen,
        listenerId,
        myNickname;

    io.setPort(8000);
    io.setServerUrl(document.location.hostname);
    ps.setNetworkAdapter(io);

    domReady(function () {

        dm.run();

        domBody = dm.query('body');
        domStartButton = dm.query('.start');
        domNickname = dm.query('input[name=nickname]');
        domReadyBtn = dm.query('.ready')
        domButtons = dm.queryAll('.answer');
        domMessage = dm.query('.message');
        domWaitMessage = dm.query('.wait-message');

        domMessage = dm.query('.message');

        domResultScreen = dm.query('.screen.result-layout');

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
        var lid = pubsub.subscribe(constants.MESSAGE.INVALID_NICKNAME, function () {
            domBody.addClass('connected');
            domBody.removeClass('wait');
            domMessage.html('Invalid nickname')
                      .after(2, function () {
                        this.html('');
                        domNickname.prop('value', '');
                      });
        });
        listenerId = pubsub.subscribe(constants.MESSAGE.PLAYER_REGISTERED, function (data) {
            if (data.nickname === myNickname) {
                pubsub.unsubscribe(constants.MESSAGE.INVALID_NICKNAME, lid);
                displayBePrepared();
            }
        });
        
        domBody.removeClass('connected');
        domBody.addClass('wait');
        myNickname = domNickname.prop('value');
        pubsub.publish(constants.MESSAGE.NEW_PLAYER, { nickname: myNickname });
    }

    function startGame () {
        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, displayGameLayout);
        domBody.removeClass('be-prepared');
        domBody.addClass('wait');
        pubsub.publish(constants.MESSAGE.PLAYER_READY, {});
    }

    function clickAnswerButton(event) {
        var payload = { response: dm.query(this).data('r'), nickname: myNickname };        
        pubsub.ping('ANSWER_SENT', payload, function () {
            domBody.removeClass('game-layout');
            domBody.addClass('confirm-layout');
        });
    }

    function displayBePrepared () {
        if (listenerId !== null) {
            pubsub.unsubscribe(constants.MESSAGE.PLAYER_REGISTERED, listenerId);
            domBody.removeClass('wait');
        } else {
            domBody.removeClass('result-layout');
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
        domBody.removeClass('confirm-layout');

        domBody.addClass('end-layout');
        listenerId = pubsub.subscribe(constants.MESSAGE.RESULT_SENT, displayResult);
    }

    function displayResult (data) {
        pubsub.unsubscribe(constants.MESSAGE.RESULT_SENT, listenerId);

        var cls = data.details.results[myNickname] ? 'yeah' : 'booh';

        domResultScreen.addClass(cls);

        domBody.removeClass('end-layout');
        domBody.addClass('result-layout');

        setTimeout(function () {
            domResultScreen.removeClass(cls);
            listenerId = null;
            displayBePrepared();
        }, 10000);
    }

    window.pubsub = ps;

});