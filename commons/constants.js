(function () {
    
    var constants = {
        MESSAGE: {
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