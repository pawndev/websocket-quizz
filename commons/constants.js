(function () {
    
    var constants = {
        MESSAGE: {
            NEW_PLAYER: 'NEW_PLAYER',
            PLAYER_REGISTERED: 'PLAYER_REGISTERED',
            INVALID_NICKNAME: 'INVALID_NICKNAME',

            GAME_START: 'GAME_START',
            QUESTION_START: 'QUESTION_START',
            ANSWER_SENT: 'ANSWER_SENT', 
            TIMER_END: 'TIMER_END',
            RESULT_SENT: 'RESULT_SENT'
        }
    }

    if (typeof module === "object" && module && typeof module.exports === "object") {
        module.exports = constants;
    } else {
        define(constants);
    }

})();