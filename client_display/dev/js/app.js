require(['domReady', '../../../commons/pubsub/adapter.socketio', '../../../commons/constants', '../../../commons/domManager/domManager', '../../../commons/pubsub/pubsub'], function (domReady, io, constants, dm, pubsub) {

    var domBody,
        listenerId,
        domQuestion,
        domMessage,
        domWaitMessage,
        questionData = {};

    io.setPort(8000);
    pubsub.setNetworkAdapter(io);

    domReady(function () {
        dm.run();

        domBody = dm.query('body');
        domQuestion = dm.query('.question');
        domAnswers = dm.queryAll('.answers');
        domMessage = dm.query('.wait .message-box');
        domWaitMessage = dm.query('.wait p:first-child');
        domAnswerText = dm.query('.final-answer');
        domAnswerLetter = dm.query('.final-answer-letter');
        domFinalQuestion = dm.query('.result-layout .question');

        domRankingResult = dm.query('.result-layout .wl');
        domRankingOver = dm.query('.game-over .wl');

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
        // if (domBody.hasClass('result-layout')) {
        //     domBody.removeClass('result-layout');
        // }
        domBody.addClass('wait');
        console.log('init');
    });

    function displayGameLayout(param) {
        pubsub.unsubscribe(constants.MESSAGE.QUESTION_START, listenerId);
        
        domBody.removeClass('wait');        
        domBody.addClass('be-prepared');

        setTimeout(function () {
            domBody.removeClass('be-prepared');

            domBody.addClass('game-layout');
            domQuestion.html(param.question);

            questionData.text = param.question;
            questionData.answers = [];

            domAnswers.forEach(function (domAnswer) {
                var ansText = param.answers[domAnswer.data('num') - 1];
                domAnswer.html(("ABCD")[domAnswer.data('num') - 1] + ". " +  ansText);
                questionData.answers.push(ansText);
            });

        }, 1000);

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
        var lid, tmpScore, rankingHtml = "";

        domBody.removeClass('end-layout');

        domFinalQuestion.html(questionData.text);
        domAnswerText.html(questionData.answers[result.goodRes - 1]);
        domAnswerLetter.html(("ABCD")[result.goodRes - 1]);

        result.score.forEach(function (player, idx) {
            rankingHtml += '<div class="row""><div class="rank">#' + (idx + 1) + '</div> - <div class="login">' + player.name + '</div><div class="score">' + player.score + 'pt(s)</div></div><div class="clear"></div>'
        });
        domRankingResult.html(rankingHtml)

        domBody.addClass('result-layout');

        listenerId = pubsub.subscribe(constants.MESSAGE.QUESTION_START, function (param) {
            domBody.removeClass('result-layout');
            displayGameLayout(param);
        });
        lid = pubsub.subscribe(constants.MESSAGE.GAME_END, function (data) {
            pubsub.unsubscribe(constants.MESSAGE.GAME_END, lid);

            console.log('GAME OVER');
            // display final score

            domBody.removeClass('result-layout');
            domBody.addClass('game-over');

            data.ranking.forEach(function (player, idx) {
                rankingHtml += '<div class="row""><div class="rank">#' + (idx + 1) + '</div> - <div class="login">' + player.name + '</div><div class="score">' + player.score + 'pt(s)</div></div><div class="clear"></div>'
            });
            domRankingOver.html(rankingHtml)

        });
    }

    window.pubsub = pubsub;

});